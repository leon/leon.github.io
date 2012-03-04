---
title: Sublime Text 2 - rsub
layout: post
tags: [sublime-text-2, textmate-2, unix]
---
## First a little introduction, what is rmate?
I read the [blog post](http://blog.macromates.com/2011/mate-and-rmate/) about TextMate 2 adding remote editing.
By typing `rmate myfile` on the server, it connects to TextMate 2 via a SSH tunnel making editing a breeze.

Sublime Text 2 now also has this functionality via the [rsub plugin](https://github.com/Drarok/rsub) (search for `rsub` via the excellent [Package Control](http://wbond.net/sublime_packages/package_control))
It uses the exact same remote script as TextMate2.

## Setup SSH to automatically create the tunnel
In a previous article [SSH Tips](/2012/01/ssh-tips/) I wrote about how a couple of lines in a config file can make your life a whole lot easier.
The new addition to the `~/.ssh/config` file is:

`RemoteForward 52698 localhost:52698`

As soon as you connect to a server via SSH it will start the remote tunnel.

## ssh-copy-rmate
I wanted it to be simple to install the rmate command to the remote server, so I created ssh-copy-rmate.
What it does is downloads the latest rmate script from github and via SSH copies it to the file `/usr/local/bin/rmate` on the server and sets the right permissions.

Since I´m using Sublime Text 2 I also created a clone of the install script called ssh-copy-rsub which names the file on the server to rsub instead of rmate.

### Install
 * [ssh-copy-rmate](https://gist.github.com/1965146) if you are using TextMate 2
 * [ssh-copy-rsub](https://gist.github.com/1957476) if you are using Sublime Text 2

and place them in your path or in `/usr/local/bin`

then run `ssh-copy-rsub root@myserver.com`

The default is to use the ruby version of the script which requires that you have ruby installed on the server.

If you specify `-b` (`ssh-copy-rsub -b root@myserver.com`) it will fetch another version of rmate which doesn't require ruby.

## References
 * [Sublime Text 2 rsub plugin](https://github.com/Drarok/rsub)
 * [TextMate 2 rmate feature](http://blog.macromates.com/2011/mate-and-rmate/)
 * [rmate ruby script](https://github.com/avian/rmate/)
 * [rmate shell script](https://github.com/aurora/rmate/)
