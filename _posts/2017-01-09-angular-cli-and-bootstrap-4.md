---
title: Angular CLI and Bootstrap 4 - The Ultimate Setup
layout: post
categories: [angular]
tags: [angular, angular-cli, font-awesome]
github: https://github.com/leon/blog-angular-cli-bootstrap-font-awesome
---

#### When starting out with angular-cli and bootstrap or material design, it's not always straight forward how you should have your project setup to maximize flexibility and ease of component development.

#### In this tutorial I will show you my setup and why I've chosen this layout.


### Lets start with the basics

```bash
ng new --skip-cli --style scss myapp
cd myapp
yarn
```

> **Note**
> I'm assuming you installed the latest [yarn](https://yarnpkg.com/en/docs/install) and [angular-cli](https://github.com/angular/angular-cli#installation)

Next we'll want to add bootstrap 4 and font-awesome

```bash
yarn add bootstrap@4.0.0-alpha.6
yarn add font-awesome
```

### Setup bootstrap and app styles
By default angular-cli adds a `styles.scss` file in the `src` folder, but since we are going to have multiple `scss` files we'll create a folder named `src/styles/`
We'll also want to split our vendor styles into it's own file. That way webpack won't have to work as hard regenerating bootstrap's scss files on every change.

In `angular-cli.json` change `styles` to be an array with two paths:

```json
"styles": [
  "styles/vendor.scss",
  "styles/main.scss"
],
```

Lets start by creating `src/styles/vendor.scss`. Navigate to `node_modules/bootstrap/scss/bootstrap.scss` and copy the contents of that file to your `vendor.scss`.

We now need to change all the paths to point to `node_modules`. Sass has a shortcut for that:

```scss
@import "reboot";
// Becomes
@import "~bootstrap/scss/reboot";
```

At the top of the bootstrap imports we have variables and mixins. By having our own variables file imported at the beginning of the file, we will be able to override any bootstrap variable.

Add `src/styles/_variables.scss` and add it as an import at the top of `vendor.scss`

```scss
@import "variables";
```

To see all available variables navigate to `node_modules/bootstrap/scss/_variables.scss`

We are now set for bootstrap development.

Start with enabling a few of the modules, and as time goes by you might want to include more and more. But by doing it this way you won't include more of bootstrap than you are using.

## Font Awesome
The same process goes for including `font-awesome` in your build.

At the bottom of the `vendor.scss` file simply add
```scss
$fa-font-path: "~font-awesome/fonts";
@import "~font-awesome/scss/font-awesome";
```

Webpack will automatically find the referenced font files and include them in the output.

The demo project is available here [github.com/leon/blog-angular-cli-bootstrap-font-awesome](https://github.com/leon/blog-angular-cli-bootstrap-font-awesome)
