# This is the personal blog of Leon Radley (www.radley.se)

## About the setup
This setup is 100% compatible with github pages. There is one quirk at the moment and that is that .less isn't compatible with github pages.
This means that you need to precompile you less into css and commit that to your repo.

I've done it by using the less textmate bundle https://github.com/appden/less.tmbundle

### How to compile
	rake build

This will automatically create the tag directory with the current tags and also a tag-cloud that you can include on a page.

### How to start the blog
	rake

This will start the blog at http://localhost:4000 and open the project in textmate.


### New blog post
	rake new

This will create a blogpost and start textmate with that file.