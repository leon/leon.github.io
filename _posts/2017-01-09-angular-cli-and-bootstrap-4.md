---
title: Angular CLI and Bootstrap 4 - The Ultimate Setup
layout: post
categories: [angular]
tags: [angular, angular-cli]
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

This will install a new app using sass as it's css compiler.

> **Note**
> I'm assuming you know how to install the latest of [yarn](https://yarnpkg.com/en/docs/install) and [angular-cli](https://github.com/angular/angular-cli#installation)

Next we'll want to add bootstrap 4 and font-awesome

```bash
yarn add bootstrap@4.0.0-alpha.6
yarn add font-awesome
```

### Setup bootstrap and app styles
By default angular-cli adds a styles.scss files in the `src` folder, but since we are going to have multiple `scss` files we'll create `src/styles`
We will also want to split our vendor styles into it's own file. That way webpack won't have to work as hard regenerating bootstrap's scss files on every change.
So we should have two entry point `scss` files, `vendor.scss` and `main.scss`

in `angular-cli.json` change the `styles` to:

```json
"styles": [
  "styles/vendor.scss",
  "styles/main.scss"
],
```

We are now going to start of with creating `src/styles/vendor.scss`. We now want to include all of bootstrap but be able to selectively exclude modules.
navigate to `node_modules/bootstrap/scss/bootstrap.scss` and copy the contents of that file to your `vendor.scss`.

We now need to change all the paths to point to `node_modules`. Sass has a shortcut for that

```scss
@import "reboot";
// Becomes
@import "~bootstrap/scss/reboot";
```

At the top of the bootstrap imports are the bootstrap variables and mixins. By having our own variables file import at the beginning of the file, we will be able to override any bootstrap variable.

Add a file `src/styles/_variables.scss` and add it as an import at the top of `vendor.scss`

```scss
@import "variables";
```

To see all available variables navigate to `node_modules/bootstrap/scss/_variables.scss`

We are now set for bootstrap development.
You can start with enabling a few of the modules, and as time goes by you might want to include more and more. But by doing it this way you won't include more of bootstrap than you are using.

## Font Awesome
The same process goes for including `font-awesome` in your build.

At the bottom of the `vendor.scss` file simply add
```scss
$fa-font-path: "~font-awesome/fonts";
@import "~font-awesome/scss/font-awesome";
```

Webpack will automatically find the referenced font files and include them in the output.

The demo project is available here [github.com/leon/blog-angular-cli-bootstrap-font-awesome](https://github.com/leon/blog-angular-cli-bootstrap-font-awesome)
