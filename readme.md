# Molten Leading (Vanilla JS version)

Manually adjusting ```line-height``` for optimum readability across a bunch of media queries is kind of a pain. With Molten Leading you can set a minimum width at which the adjustment starts, a maximum element width where it stops, and a minimum and maximum line height to adjust through.

All the work here is based on [@Wilto’s Molten-Leading](https://github.com/Wilto/Molten-Leading) jQuery plugin.


# Usage instructions

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
  minline: 1.2,  // Minimum line height
  maxline: 1.8,  // Maximum line height
  minwidth: 320, // Minimum element width where the adjustment starts
  maxwidth: 1024 // Maximum element width where the adjustment stops
});
```


## Notes:
* Tested to be working all the way down to IE6. side note: if you need to support IE6 & 7 you’re gonna have to use "tag selectors", since the plugin uses getElementsByTagName as a fallback if querySelector isn’t supported.
* Built Progressive Enhancement in mind, so the plugin will silently fail when a browser doesn’t support certain selector (looking at IE6 & 7).
* There’s a demo <a href="http://wilto.github.com/Molten-Leading/">right hurr</a>.
* Full credits go to both <a href="http://twitter.com/nicewebtype">Wilto</a> who wrote the orinal plugin and to <a href="http://twitter.com/nicewebtype">Tim Brown</a> for <a href="http://nicewebtype.com/notes/2012/02/03/molten-leading-or-fluid-line-height/">the original idea</a>.
