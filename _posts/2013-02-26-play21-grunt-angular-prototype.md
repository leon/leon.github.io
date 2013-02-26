---
layout: post
title: Play 2.1 Grunt, Angular - Prototype
github: https://github.com/leon/play-grunt-angular-prototype
tags: [play, js, angular]
---

#### I've done a Play 2.1 Grunt / Angular prototype that I'd like to share with you.

### Preface
Being able to run grunt side by side with play is an awesome setup. Using Less or compass without sluggish rhino. Use coffeescript, typescript, dart...
We also get js linting, image compression and more...

### Implementation
At the moment this is just a prototype. It hooks on to plays sbt plugins, start and stop commands and fires up grunt and pipes it's commands into sbt.

It also makes npm, bower, yo available at the sbt console, so you never have to leave play to get a new dependency or run yo's scaffolding tasks.

I've set it up so that we have a separate root called ui where the (in this case) angular app will live.
It uses the public folder as it's dist output, which means we can then use plays normal Assets controller to include them.

It uses bower to import bootstrap into /ui/components and then we include bootstrap in our main.less file (so that we can use all the awesome mixins)

We also get angular, angular-bootstrap and a couple of shims via bower.
By having these in the component.js file we can simply run bower install from the sbt console to get all the components.

When play starts up it also hooks into grunt's watch command (by running grunt dev, which includes the watch command)
This means it will start watching less, and js files (all settings are configurable through the Gruntfile.js)

It also starts up live reload, so by installing the live reload plugin for chrome, you can press cmd + s and see the design getting updated straight away without having to do a refresh.

### Conclusion
I think this marriage between backend and frontend is a match made in heaven. It will only get better with the coming web components, where it will no longer be possible to go out and fetch the individual components manually. 

<https://github.com/leon/play-grunt-angular-prototype>