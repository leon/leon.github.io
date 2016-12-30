---
title: Sublime Text - YUI Compressor Plugin
categories: [develop]
tags: [sublime-text]
---
#### Could't find a plugin for using the YUI Compressor so I wrote one.

The plugin calls the yui-compressor jar file, I've used some settings to avoid putting everything on one single line since most text editors grind to a halt
when having to deal with long lines.

```bash
java
-jar yuicompressor-2.4.7.jar
--charset utf-8
--preserve-semi
--line-break 150
-o ${file_base_name}-min.${file_extension}
```

## Installation
Use package control <http://wbond.net/sublime_packages/package_control> and search for YUI Compressor

The source code can be found here: <https://github.com/leon/YUI-Compressor>

## Gettings started
Make sure you have java installed, then open a .js or .css file and press `F7` or `command + b`.

The plugin generates a new file along side the original with the extension `.min.js` or `.min.css`
