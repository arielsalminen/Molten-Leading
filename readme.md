# Molten Leading (plain JS version)

Manually adjusting ```line-height``` for optimum readability across a bunch of media queries is kind of a pain. With Molten Leading you can set a minimum width at which the adjustment starts, a maximum element width where it stops, and a minimum and maximum line height to adjust through.

All the work here is based on [@Wilto’s Molten-Leading](https://github.com/Wilto/Molten-Leading) jQuery version of the plugin.

#### Features:

* Automatically adjust line-height based on element width for optimal readability.
* Works in all major desktop and mobile browsers, including IE 6 and up.
* Uses requestAnimationFrame for the best possible performance.
* Free to use in both commercial and non-commercial projects.
* Doesn’t require external JavaScript libraries.
* Supports "px", "em" and "rem" CSS units.
* Weighs only 1.17Kb minified and Gzip’ed.
* Supports multiple instances.


## Demo

* There’s <a href="https://arie.ls/molten-leading/">a demo here</a>, try resizing your browser window.

## Usage instructions

Following the steps below you should be able to get everything up and running.

1. Link files:
```html
<script src="moltenleading.js"></script>
```

2. Hook up the plugin:
```html
<!-- Put this right before the </body> closing tag -->
<script>
  moltenLeading("h1");
</script>
```

4. Customizable options:
```javascript
moltenLeading("h1", {
  minline: 1.2,    // Integer: Minimum line-height for the element (multiplied by the element's font-size)
  maxline: 1.8,    // Integer: Maximum line-height for the element (multiplied by the element's font-size)
  minwidth: 320,   // Integer: Minimum element width where the adjustment starts
  maxwidth: 768,   // Integer: Maximum element width where the adjustment stops
  units: "px"      // String: CSS units used for the min & max widths, can be "px", "em" or "rem"
});
```

## Public methods

There’s currently one public method, ```refresh()```. Refresh allows you to manually call Molten Leading’s update methods that calculate and update the line-height of specified element(s). Example of the usage:

```javascript
var myLeading = moltenLeading("h1", {
  minline: 1.2,
  maxline: 1.8
});

// Then somewhere later on:
myLeading.refresh();
```


## Notes

* Tested to be working all the way down to IE6. side note: if you need to support IE6 & 7 you’re gonna have to use simple "tag selectors," since the plugin uses getElementsByTagName as a fallback if querySelector isn’t supported.
* Built progressive enhancement in mind, so the plugin will silently fail when a browser doesn’t support certain selector (only IE6 & 7).
* When using ```em``` units, keep in mind that ems are relative to the currently specified font-size of the parent element, so the width might not always be what you think it is.
* The ```rem``` units are relative to the ```<html>``` element’s font-size instead, so they are a bit easier to grasp.
* Full credits go to both <a href="http://twitter.com/wilto">Wilto</a> who wrote the orinal plugin and to <a href="http://twitter.com/nicewebtype">Tim Brown</a> for <a href="http://nicewebtype.com/notes/2012/02/03/molten-leading-or-fluid-line-height/">the original idea</a>.


## Possible performance bottlenecks

* Don’t use CSS ```transition: all``` inside Molten Leading enabled containers, will make window.resize performance slower.


## Running on localhost

1. Clone this repo by running ```git clone git@github.com:arielsalminen/Molten-Leading.git```
2. If you’re using Mac OS X, open the "Molten-Leading" folder and run ```python -m SimpleHTTPServer 8000```
3. Done! Now view the project at [http://localhost:8000](http://localhost:8000)


## Tested on the following platforms

* iOS 4.2.1+
* Android 2.3+
* Windows Phone 7.5+
* Blackberry 7.0+
* Blackberry Tablet 2.0+
* Jolla
* Firefox Phone
* Kindle 3.3+
* Symbian Belle
* Symbian S40 Asha
* webOS 2.0+
* Windows XP
* Windows 7
* Mac OS X


## Changelog

`1.20` (2014-07-09) - Adds support for ```px```, ```em``` and ```rem``` units in addition to performance optimization.

`1.10` (2014-06-26) - Performance improvements. Handles debouncing of events now via requestAnimationFrame, which removes the need for the previous threshold setting. Adds also public methods.

`1.03` (2014-06-24) - Fixes debouncing of events and optimizes performance (adds also an option to control the debounce timing).

`1.02` (2014-06-21) - Adds minified version.

`1.01` (2014-06-21) - Removes unnecessary code.

`1.00` (2014-06-19) - First release.
