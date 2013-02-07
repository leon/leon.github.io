---
layout: post
title: JSON Action Composition
tags: [play]
---

#### I wanted to share this action with you since it simplifies dealing with incoming json requests a lot.

### This is what we want to accomplish.

instead of having to write this.

{% highlight scala %}
def create() = Action(parse.json) { implicit request =>
  request.body.validate[User].fold(
    valid = { user =>
      User.save(user)
      Ok(Json.toJson(user))
    },
    invalid = (e => BadRequest(JsError.toFlatJson(e)).as("application/json"))
  )
}
{% endhighlight %}

we want to be able to write this.

{% highlight scala %}
import controllers.Actions._

// Make sure there is a implicit Reads[User] available...
def create = JsonAction[User] { user =>
  User.save(user)
  Ok(Json.toJson(user))
}
{% endhighlight %}

### The implementation
This assumes that you have a JSON `Reads[A]` available as an implicit variable.

See [Writing Reads[T] combinators](http://www.playframework.com/documentation/2.1.0/ScalaJsonCombinators) in the documentation.

Start by putting this in a file called `Actions.scala` in your `controllers` dir and as you see in the above example we import all the actions defined in that file by writing `import controllers.Actions._`

{% highlight scala %}
package controllers

import play.api.mvc._
import play.api.libs.json._

object Actions extends Results with BodyParsers {

  /**
   * Simplifies handling incoming JSON by wrapping validation and returning BadRequest if it fails
   * @param action the underlying action
   * @tparam A a class that has an implicit Read available
   * @return a response
   */
  def JsonAction[A](action: A => Result)(implicit reader: Reads[A]): EssentialAction = {
    Action(parse.json) { implicit request =>
      request.body.validate[A].fold(
        valid = { json =>
          action(json)
        },
        invalid = (e => BadRequest(JsError.toFlatJson(e)).as("application/json"))
      )
    }
  }
}
{% endhighlight %}

### Conclusion
Understanding Scala is a lot harder than Java, at least for me, coming from a non functional background. 
But after completing [the on-line course, functional programming in Scala by Martin Odersky](https://www.coursera.org/course/progfun),
I feel a lot more comfortable in Scala and Play!
