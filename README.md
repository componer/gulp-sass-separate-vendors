# Gulp Sass Separate Vendors

Separate sass vendors which import by `@import` to another file in gulp pipe line.

## Install

```
npm install --save-dev gulp-sass-separate-vendors
```

## Usage

```
import SeparateVendors from 'gulp-sass-separate-vendors'
var separator = SeparateVendors()

gulp.src('test.scss')
    .pipe(separator.init())
    .pipe(sass())
    .pipe(separator.compile())
    .pipe(separator.combine())
    .pipe(gulp.dest('.'))
```

The previous code will help to get two css files, one contains only vendors style and the other one contains the source style without vendors.

**Notice:** one `separator` can be called in only one pipe line, do not reuse it in another pipe line.

**Notice:** `@import "some-module";` should be at the first place in a scss text line, and do not put it at the begin of a line in comments.

## Options

You can pass `options` into the generator function like previous example code.

```
{
    vendors: ['bootstrap-sass', '_settings.scss', './my-styles.scss'],
    extract: -1|0|1,
}
```

**vendors**

*boolean or array*

Which modules do you want to put in vendors.css file.
If vendors is `undefined` or `true`, all modules will be contained in vendors.

It is a little difficult to understand: if you set vendors to be true or undefined, all imported modules will be treated as vendors. For example:

```
// main.scss
@import "bootstrap-sass";
@import "settings"; // _settings.scss
@import "colors.scss";
@import "../a.scss";
...
```

All of those modules will be treated as vendors. However, in fact, you want to keep ../a.scss as internal style in output bundle css file. At this time, you should have to set vendors as an array:

```
{
  "vendors": ["bootstrap-sass", "settings", "colors.scss"]
  // Notice:
  // 1. name of modules should be same
  // 2. do not input "../a.scss" into vendors, so that "../a.scss" will compile into internal style css file
}
```

Now, let look into '../a.scss'. Sometimes, you will import some other modules in ../a.scss:

```
// a.scss
@import "google-font";
...
```

You want to put "google-font" into vendors bundle file as a vendor. You should input "google-font" into vendors array, or it will be compile into internal style file because a.scss being treated as an internal module.

**extract**

*number*

1: only vendors.css file.<br>
0 or false or undefined: vendors in vendors file, and internal styles in single file, two output files.<br>
-1: only styles without vendors.

## Methods/API

**.init(vendors)**

Should be called before sass compiler. It will record scss modules.

Set vendors here if you have not set `options.vendors`.

**.compile()**

Should be called after sass compiler. It will re-organize output files.

**.combine()**

Should be called after `.compile()`. Both vendors bundle file and style bundle file will be created.

If you do not call `.extract` after `.combine`, both these bundle files will be output.

**.extract(which)**

Should be called after `.combine()`. You use this to determine which bundle file to output only.

Set `which` to be 1 if you want to get .vendors.css only. If you want to get style bundle file only, set `which` to be -1.

If you do not set `which`, it will use `options.extract` instead.

```
import SeparateVendors from 'gulp-sass-separate-vendors'
var separator = SeparateVendors()

gulp.src('test.scss')
    .pipe(separator.init(['bootstrap-sass', 'google-font']))
    .pipe(sass())
    .pipe(separator.compile())
    .pipe(separator.combine())
    .pipe(separator.extract(1)) // get only vendors bundle file
    .pipe(gulp.dest('.'))
```

## Generator

This package is generated by [componer](https://github.com/tangshuang/componer).
If you want to modify the source code, do like this:

```
# install componer
npm i -g componer
# get from registry
git clone https://github.com/componer/gulp-sass-separate-vendors.git
# install dependencies
cd gulp-sass-separate-vendors && cpon install
# build this package
cpon build
```

To learn more about componer, read [this](https://github.com/tangshuang/componer).
