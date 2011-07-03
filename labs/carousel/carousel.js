Number.implement({
	zeroPad: function(length){
		var str = '' + this;
		while(str.length < length)
			str = '0' + str;
		return str;
	}
});

Class.Binds = new Class({
	$bound: {},
	bound: function(name){
		return this.$bound[name] ? this.$bound[name] : this.$bound[name] = this[name].bind(this);
	}
});

Fx.Spring = new Class({

	Extends: Fx,

	options: {
		stiffness: 70,
		friction: 10,
		threshold: 0.03
	},

	initialize: function(options) {
		this.parent(options);
		this.threshold = this.options.threshold;
		this.dt = 1 / this.options.fps;
		this.velocity = 0;
		this.acceleration = 0;
		this.from = 0;
		this.inMotion = false;
	},

	step: function() {
		if (this.inMotion) {
			this.acceleration = this.options.stiffness * (this.to-this.from) - this.options.friction * this.velocity;
			this.velocity += this.acceleration * this.dt;
			this.from += this.velocity * this.dt;
			this.inMotion = Math.abs(this.acceleration) >= this.threshold || Math.abs(this.velocity) >= this.threshold;
			this.fireEvent('motion', this.from);
		} else {
			this.complete();
		}
	},

	complete: function() {
		if (!this.isRunning()) return this;
		this.velocity = 0;
		this.acceleration = 0;
		this.from = this.to;
		this.inMotion = false;
		this.stop();
		return this;
	},

	start: function(from, to) {
		this.from = from;
		this.to = to;
		if (this.isRunning()) return this;

		this.inMotion = true;
		this.parent(from, to);
		return this;
	},

	get: function() {
		return this.from || 0;
	},

	set: function(val) {
		this.from = val;
	}
});
var requestAnimationFrame = this.requestAnimationFrame
	|| this.webkitRequestAnimationFrame
	|| this.mozRequestAnimationFrame
	|| this.oRequestAnimationFrame
	|| this.msRequestAnimationFrame;
var Sprite = new Class({

	Extends: Options,

	options: {
		frames: 1,
		states: 1,
		fps: 60
	},

	timer: null,
	frame: 0,
	state: 0,
	size: null,

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.size = this.element.getSize();
		return this;
	},

	play: function(frame){
		if(frame)
			this.goto(frame);
		clearInterval(this.timer);
		if(requestAnimationFrame){
			var self = this;
			this.timer = true;
			var animationFrame = function(){
				requestAnimationFrame(function(){
					self.farward();
				});
				if(self.timer)
					animationFrame();
			};
		} else {
			this.timer = this.forward.periodical(1000 / this.options.fps, this);
		}
		return this;
	},

	playRandom: function(start, end){
		clearInteval(this.timer);
		this.timer = this.random.periodical(1000 / this.options.fps, this, arguments);
		return this;
	},

	stop: function(){
		if(requestAnimationFrame){
			this.timer = false;
		} else {
			clearInterval(this.timer);
		}
		return this;
	},

	forward: function(){
		this.goto(this.frame += 1);
		return this;
	},

	backward: function(){
		this.goto(this.frame -= 1);
		return this;
	},

	goto: function(frame){
		var f = this.options.frames-1;
		this.frame = frame > f ? 0 : (frame < 0 ? f : frame);
		this.render(this.frame);
		return this;
	},

	gotoLinear: function(x){
		var f = this.options.frames;
		this.frame = (Math.round(x) % this.options.frames);
		this.render(this.frame);
		return this;
	},

	random: function(start, end){
		this.goto(Number.random(start || 0, end || this.options.frames));
		return this;
	},

	randomState: function(start, end){
		this.state = Number.random(start || 0, end || this.options.states - 1);
		return this;
	},

	render: function(frame){
		this.element.setStyle('background-position', [-(this.size.x * frame), -(this.size.y * this.state)]);
	}
});

var Carousel = new Class({

	Extends: Sprite,

	Implements: [Options, Events, Class.Binds],

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
	},

	image: null,
	images: [],
	document: null,
	isMouseDown: false,

	initialize: function(image, filename, options){
		this.setOptions(options);
		this.filename = filename;
		this.image = document.id(image);
		this.document = document.id(document);
		this.images = [];

		if(this.options.mouse)
			this.image.addEvents({
				mousedown: this.bound('mouseDown'),
				touchstart: this.bound('mouseDown')
			});

		if(this.options.autoPlay){
			this.createImages();
			this.play();
		} else {
			this.image.addEvent('click', this.bound('attach'));
		}
	},

	attach: function(){
		this.image.removeEvent('click', this.bound('attach'));
		this.createImages();
		this.play();
	},

	createImages: function(){
		this.options.frames.times(function(i){
			this.images.push(this.filename.substitute({num:(i).zeroPad(3)}));
			new Element('img', {src: this.images[i]});
		}, this);
	},

	render: function(frame){
		this.image.set('src', this.images[frame]);
	},

	mouseDown: function(event){
		event.preventDefault();
		this.stop();
		this.isMouseDown = true;
		if(this.fx && this.fx.isRunning())
			this.fx.cancel();
		this.fx = new Fx.Spring(Object.merge(this.options.move, {
			onMotion: this.bound('gotoLinear'),
			onComplete: this.bound('mouseComplete'),
			onStop: this.bound('mouseComplete')
		}));
		this.fx.set(event.page.x);
		this.fx.start(this.fx.get(), event.page.x);
		this.document.addEvents({
			mousemove: this.bound('mouseMove'),
			mouseup: this.bound('mouseUp'),
			touchmove: this.bound('mouseMove'),
			touchend: this.bound('mouseUp')
		});
	},

	mouseMove: function(event){
		this.fx.start(this.fx.get(), event.page.x);
	},

	mouseUp: function(event){
		this.isMouseDown = false;
		this.document.removeEvents({
			mousemove: this.bound('mouseMove'),
			mouseup: this.bound('mouseUp')
		});
	},

	mouseComplete: function(){
		if(this.isMouseDown) return;
		this.fx = null;
		if(this.options.resume)
			this.play.delay(this.options.resume, this);
	}
});

window.addEvent('domready', function(){
    new Carousel('wei', 'img/weixioaming{num}.jpg', {
        frames: 36,
        autoPlay: true
    });
});