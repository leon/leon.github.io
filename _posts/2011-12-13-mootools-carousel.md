---
layout: post
title: MooTools Carousel
tags: [mootools]
---
#### I wrote a 3D carousel in 2006. Back then it was written in the newly released ActionScript 3. But as you all know, flash isn't what all the cool guys use nowadays.

So what I've done is revamp my old code and made it a lot cooler. By using [Fx.Spring](https://github.com/clau/Fx.Spring/ "MooTools Fx.Spring") I could simulate friction.

Try swiping the image. Also try it on the iPad it's touch enabled!

<nav class="actions">
<a class="button" href="/labs/carousel/">Demo</a>
</nav>

## The tech
By using the new javascript function `RequestAnimationFrame` I could make it run alot smoother. Otherwise the javascript uses `setTimeout(fn, 60)` which causes the browser to stall if it can't handle the load.

`RequestAnimationFrame` handles it differently, it fires your callback whenever your system can handle it.

You also get a **bonus**, when the browser detects that your tab isn't visible it doesn't fire any `RequestAnimationFrame`.

### Options
{% highlight js %}
options: {
	fps: 20,
	frames: 0,
	autoPlay: true,
	resume: 3000,
	mouse: true,
	inverseMouse: false,
	move: {
		stiffness: 20,
		friction: 10,
		threshold: 0.05
	}
}
{% endhighlight %}

### Usage
{% highlight js %}
new Carousel('placeholderimageid', 'img/image-sequence{num}.jpg', {
	frames: 36,
	autoPlay: true
});
{% endhighlight %}
