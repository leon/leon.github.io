---
layout: lab
title: Image Resizing for Play Framework 2
github: https://github.com/digiPlant/play-scalr
---
# Image Resizing for Play Framework 2
#### Integrates nicely into Play's reverse routing, and by using [play-res](/project/play-res) for file storage and caching, it's easily hooked into nginx for static file serving.

[![Build Status](https://secure.travis-ci.org/digiPlant/play-scalr.png)](http://travis-ci.org/digiPlant/play-scalr)

## Add plugin to dependencies
{% highlight scala %}
val appDependencies = Seq(
	"se.digiplant" %% "play-scalr" % "CHECK_GITHUB_FOR_LATEST_VERSION"
)

val root = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
  resolvers += "OSS Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/",
  // To simplify the reverse routing we can import the digiPlant namespace
  templatesImport ++= Seq(
    "se.digiplant._"
  )
)
{% endhighlight %}

## Add to `conf/application.conf`
{% highlight properties %}
# Resource plugin save directory
# is relative to app, but can be absolute to filesystem also
res.default=res/default

# Scalr image cache location (This is simply another play-res source location)
# All resized images get cached here so they only need to be resized once
res.scalrcache=res/scalr

# Tell scalr to use scalrcache source we just created to cache it's images
scalr.cache=scalrcache
{% endhighlight %}

## Add to `conf/routes`
{% highlight text %}
# Image scaling for play-res plugin
GET    /res/:width/:height/:file      se.digiplant.scalr.ScalrResAssets.at(file, width: Int, height: Int)

# Image resizing for any folder specified as path parameter (will cache thumbnails using play-res plugin)
GET    /scalr/:width/:height/*file    se.digiplant.scalr.ScalrAssets.at(path="/public/images", file, width: Int, height: Int)

{% endhighlight %}

# Usage

## Reverse routing to the play-res plugin backed scalr resizer
The play-res plugin generates a unique sha1 hash of the file and stores the file on disk in an optimal `4char/4char/sha1hash.ext` directory structure.
By only having to save the fileuid (5564ac5e3968e77b4022f55a23d36630bdeb0274.jpg) to the db it's easy to retrieve the image or other document (see play-res documentation)


{% highlight html %}
<img src="@scalr.routes.ScalrResAssets.at("5564ac5e3968e77b4022f55a23d36630bdeb0274.jpg", 150, 100)" alt="" />
{% endhighlight %}

## Reverse routing to a directory resizer
Will take the image `/public/images/test/myimage.jpg` and resize it to 150, 100 and store it in `res/scalr/test/myimage_150x100.jpg` and return the url as specified in the routes file.

{% highlight html %}
<img src="@scalr.routes.ScalrAssets.at("test/myimage.jpg", 150, 100)" alt="" />
{% endhighlight %}

## Modes
By specifying a mode you can fit the image within the bounding box in different ways.
{% highlight scala %}
// Specify one of automatic, fit_exact, fit_to_width, fit_to_height, crop, default is automatic
scalr.routes.ScalrAssets.at("test/myimage.jpg", 150, 100, "crop")
{% endhighlight %}

# Advanced Usage
You can specify multiple sources if you would like to split you images into categories, such as profile images / uploads.
By then adding another source in `conf/application.conf`

{% highlight properties %}
res.profile=res/profile
{% endhighlight %}

you will also have to add another route

{% highlight text %}
GET    /profile/:width/:height/:file      se.digiplant.scalr.ScalrResAssets.at(source="profile", file, width: Int, height: Int)
{% endhighlight %}

- [Source](https://github.com/digiPlant/play-scalr)
