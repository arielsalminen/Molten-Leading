/*!
 * Molten Leading, plain JavaScript version, v1.20
 * https://github.com/viljamis/Molten-Leading
 */
(function (window, document, undefined) {
  "use strict";

  /**
   * Shim layer for requestAnimationFrame with setTimeout fallback
   */
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           function (callback) { window.setTimeout(callback, 1000 / 60); };
  })();

  /**
   * Utilities
   */
  var util = {

    /**
    * Merge object into target
    *
    * @param  {target} the object for other objects to be merged into
    * @return {Object} the merged object (a reference to target)
    */
    extend : function (target) {
      var args = arguments;

      this.forEach(args, function (i) {
        var source = args[i];
        for (var property in source) {
          if (source.hasOwnProperty(property)) {
            target[property] = source[property];
          }
        }
      });

      return target;
    },

    /**
     * Simple bind method
     *
     * @param  {function} callback function
     * @param  {object} context
     */
    bind : function (fn, context) {
      return function () {
        fn.apply(context, arguments);
      }
    },

    /**
     * forEach method
     *
     * @param  {array} array to loop through
     * @param  {function} callback function
     * @param  {object} context
     */
    forEach : function (array, callback, context) {
      var length = array.length;
      var cont, i;

      for (i = 0; i < length; i++) {
        cont = callback.call(context, i, array[i]);
        if (cont === false) {
          break; // Allow early exit
        }
      }
    },

    /**
     * Executes a function when window resize ends
     *
     * @param  {function} callback function
     * @param  {integer} milliseconds to wait
     * @param  {object} context
     */
    onResizeEnd : function (fn, threshold, context) {
      var timer;
      return function () {
        threshold = threshold || 250;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, arguments);
        }, threshold);
      }
    },

    /**
     * Adds event listeners
     *
     * @param  {element} the element which the even should be added to
     * @param  {event} the event to be added
     * @param  {function} the function that will be executed
     */
    addListener : function (el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        el.addEventListener(evt, fn, bubble);

      } else if ("attachEvent" in el) {

        // check if the callback is an object and contains handleEvent
        if (typeof fn === "object" && fn.handleEvent) {
          el.attachEvent("on" + evt, function () {

            // Bind fn as this
            fn.handleEvent.call(fn);
          });
        } else {
          el.attachEvent("on" + evt, fn);
        }
      }
    }
  }

  /**
   * The MoltenLeading object
   *
   * @param  {String} CSS selector for target elements
   * @param  {Object} MoltenLeading options
   * @constructor
   */
  function MoltenLeading(selector, options) {
    this.body = document.body;
    this.selector = selector;
    this.ticking = false;
    this.testel = null;
    this.reminpx = 0;
    this.eminpx = 0;

    this.options = util.extend({}, MoltenLeading.defaultOptions, options);

    // If querySelector is supported, use that
    if ("querySelector" in document && document.querySelector(this.selector)) {
      this.elements = document.querySelectorAll(this.selector);

    // If querySelector is not supported, use getElementsByTagName (for IE7 & 6)
    } else if (document.getElementsByTagName(this.selector)) {
      this.elements = document.getElementsByTagName(this.selector);
    }
  }

  MoltenLeading.prototype = {
    constructor : MoltenLeading,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      if (this.options.units !== "px") {
        this.testel = document.createElement("div");
        this.testStyles(this.testel);
        this.throttledUpdate = util.onResizeEnd(this.doUnitConversions, 100, this);
        util.addListener(window, "resize", this.throttledUpdate, false);
        this.doUnitConversions();
      }

      // Update leading on window resize
      util.addListener(window, "resize", this, false);
      this.update();
    },

    /**
     * Refresh all calculations
     *
     * @public
     */
    refresh : function () {
      this.doUnitConversions();
      this.update();
    },

    /**
     * Updates leading when needed
     *
     * @function
     * @private
     */
    update : function () {
      util.forEach(this.elements, this.calcLeading, this);
      this.ticking = false;
    },

    /**
     * Attach this as the event listener
     *
     * @function
     * @private
     */
    handleEvent : function () {
      this.requestTick();
    },

    /**
     * Do unit conversions
     *
     * @function
     * @private
     */
    doUnitConversions : function () {
      if (this.options.units === "rem") {
        this.getRems();
      } else if (this.options.units === "em") {
        util.forEach(this.elements, this.getEms, this);
      }

      // …aand finally get up to date measures
      this.update();
    },

    /**
    * Calculates the appropriate leading and updates DOM
    *
    * @param  {index} the index of the element
    * @param  {Element} the element to calculate the leading for
    * @return {string} the calculated leading for the element
    * @private
    */
    calcLeading : function (i, el) {
      var elwidth = 0;
      var o = this.options;

      if (o.units === "rem") {
        elwidth = el.offsetWidth / this.reminpx;
      } else if (o.units === "em") {
        elwidth = el.offsetWidth / this.eminpx;
      } else {
        elwidth = el.offsetWidth;
      }

      var widthperc = parseInt((elwidth - o.minwidth) / (o.maxwidth - o.minwidth) * 100, 10);
      var linecalc = o.minline + (o.maxline - o.minline) * widthperc / 100;

      if (widthperc <= 0 || linecalc < o.minline) {
        linecalc = o.minline;
      } else if (widthperc >= 100 || linecalc > o.maxline) {
        linecalc = o.maxline;
      }

      el.style.lineHeight = linecalc;
    },

    /**
    * Calculates the value of 1rem in pixels
    *
    * @return {string} the value of 1rem in pixels
    * @private
    */
    getRems : function () {
      this.origFontSize = this.body.style.fontSize;

      // Reset body to ensure the correct value is returned
      this.body.style.fontSize = "100%";
      this.body.appendChild(this.testel);

      // Cache the value
      this.reminpx = parseFloat(this.testel.offsetWidth, 10);

      if (this.body.contains(this.testel)) {
        this.body.removeChild(this.testel);
      }

      this.body.style.fontSize = this.origFontSize;
    },

    /**
    * Calculates the value of 1em inside certain element in pixels
    *
    * @param  {index} the index of the element
    * @param  {Element} the element to calculate the em from
    * @return {string} the value of 1em in pixels
    * @private
    */
    getEms : function (i, el) {
      el.appendChild(this.testel);

      // Cache the value
      this.eminpx = parseFloat(this.testel.offsetWidth, 10);

      if (this.body.contains(this.testel)) {
        this.testel.parentNode.removeChild(this.testel);
      }
    },

    /**
    * Gives styles for the units test elements
    *
    * @param  {element} the element to give the styles to
    * @private
    */
    testStyles : function (el) {
      var css = el.style;
      css.visibility = "hidden";
      css.position = "absolute";
      css.fontSize = "1em";
      css.width = "1em";
      css.padding = "0";
      css.border = "0";
    },

    /**
     * Calls rAF if it hasn't been already called,
     * ensuring events don't get stacked
     *
     * @private
     */
    requestTick : function () {
      if (!this.ticking) {
        requestAnimFrame(util.bind(this.update, this));
        this.ticking = true;
      }
    }

  };

  /**
   * Default options
   */
  MoltenLeading.defaultOptions = {
    minline: 1.2,    // Integer: Minimum line-height for the element (multiplied by the element's font-size)
    maxline: 1.8,    // Integer: Maximum line-height for the element (multiplied by the element's font-size)
    minwidth: 320,   // Integer: Minimum element width where the adjustment starts
    maxwidth: 768,   // Integer: Maximum element width where the adjustment stops
    units: "px"      // String: CSS units used for the min & max widths, can be "px", "em" or "rem"
  };

  /**
   * Expose a public-facing API
   *
   * @param  {String} CSS selector for target elements
   * @param  {Object} the options
   */
  function expose(selector, options) {
    var mtl = new MoltenLeading(selector, options);
    mtl.init();
    return mtl;
  }
  window.moltenLeading = expose;

}(window, document));
