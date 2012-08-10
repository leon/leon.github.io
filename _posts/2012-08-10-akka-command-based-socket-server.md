---
layout: post
title: Akka command based socket server
image: /assets/post/plug.jpg
github: https://github.com/leon/akka-command-based-socketserver
tags: [akka]
---

#### Using Akka.IO Iteratees to build a simple socket server.

We start of with the same base as in the [Akka IO http sample](http://doc.akka.io/docs/akka/snapshot/scala/io.html#Http_Server)

{% highlight scala %}
class SocketServer(address: InetSocketAddress, addressPromise: Promise[SocketAddress]) extends Actor {

  val state = IO.IterateeRef.Map.async[IO.Handle]()(context.dispatcher)
  val server = IOManager(context.system) listen (address)

  override def postStop() {
    server.close()
    state.keySet foreach (_.close())
  }

  def receive = {
    case Timeout =>
      postStop()

    case IO.Listening(server, address) =>
      addressPromise.success(address)

    case IO.NewClient(server) =>
      import SocketConstants._
      val socket = server.accept()
      state(socket) flatMap (_ => SocketServer.processRequest(socket))

    case IO.Read(socket, bytes) => state(socket)(IO.Chunk(bytes))

    case IO.Closed(socket, cause) =>
      state(socket)(IO.EOF(None))
      state -= socket
  }
}
{% endhighlight %}

What this does is enable clients to connect and if there are any bytes arriving on the socket it will get to our `SocketServer.processRequest`.

## This is where the fun starts

Using Iteratees we can manipulate the incomming stream of chars, looking ahead to see what's available with `IO.peek` or dropping chars we don't care about with `IO.drop`.

> **IO.Iteratee** Included with Akka’s IO module is a basic implementation of Iteratees. Iteratees are an effective way of handling a stream of data without needing to wait for all the data to arrive. This is especially useful when dealing with non blocking IO since we will usually receive data in chunks which may not include enough information to process, or it may contain much more data then we currently need.

{% highlight scala %}
object SocketServer {

  // Import some predefined ByteStrings we have defined
  import SocketConstants._

  def processRequest(implicit socket: IO.SocketHandle): IO.Iteratee[Unit] = {
    // As long as the socket is open keep looking
    IO.repeat {
      // Look at the first four chars and if they match any of the defined command let them continue parsing the stream.
      IO.take(4).flatMap {
        case Exit.command => Exit.read
        case Help.command => Help.read
        case Echo.command => Echo.read
        case Date.command => Date.read
        case Rand.command => Rand.read
        // If no commands match, the Unknown command will consume the rest of the input.
        case _ => Unknown.read
      }
    }
  }
}
{% endhighlight %}

## A couple of commands

### Exit

The Exit command takes everything until it reaches the end of the line.
The `EOL` is simply a shorthand for `ByteString("\r\n")`.

{% highlight scala %}
object Exit extends Command {

  val command = ByteString("EXIT")

  def read(implicit socket: IO.SocketHandle) = {
    for {
      _ <- IO takeUntil EOL
    } yield {
      println("Exit")
      socket.close()
    }
  }
}
{% endhighlight %}

### Echo

The Echo command isn't that different that the exit command, but instead of closing the socket it takes and outputs it back to the socket.

{% highlight scala %}
object Echo extends Command {

  val command = ByteString("ECHO")

  def read(implicit socket: IO.SocketHandle) = {
    for {
      all <- IO takeUntil EOL
    } yield {
      println("Echo: " + all)
      socket.write(all ++ EOL)
    }
  }
}
{% endhighlight %}

### Date

The Date command shows us that we can parse the incoming bytes using nested iteratees.

{% highlight scala %}
// Predefined parsers
object SocketIteratees {
  def ascii(bytes: ByteString): String = bytes.decodeString("US-ASCII").trim
  def dateTime(bytes: ByteString): DateTime = DateTime.parse(ascii(bytes), DateTimeFormat.forPattern("yy-MM-dd"))
}

object Date extends Command {

  val command = ByteString("DATE")

  def read(implicit socket: IO.SocketHandle) = {

    import SocketIteratees.dateTime

    for {
      _ <- IO drop 1
      date <- IO takeUntil EOL map dateTime
    } yield {
      println(date)
      socket.write(ByteString(date.toString("yy/MM/dd")) ++ EOL)
    }
  }
}
{% endhighlight %}

## Fork and try it out

I've created a [demo project](https://github.com/leon/akka-command-based-socketserver) of the code go try it out.