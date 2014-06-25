/*!
 * Molten Leading, plain JavaScript version, v1.1
 * https://github.com/viljamis/Molten-Leading
 */
(function (window, document, undefined) {

  "use strict";

  /**
   * The MoltenLeading object
   *
   * @param  {String} CSS selector for target elements
   * @param  {Object} MoltenLeading options
   * @constructor
   */
  function MoltenLeading(selector, options) {
    this.ticking = false;
    this.selector = selector;
    this.options = this._extend({}, MoltenLeading.defaultOptions, options);

    // If querySelector is supported, use that
    if ("querySelector" in document && document.querySelector(this.selector)) {
      this.elements = document.querySelectorAll(this.selector);

    // If querySelector is not supported, use getElementsByTagName (for IE7 & 6)
    } else if (document.getElementsByTagName(this.selector)) {
      this.elements = document.getElementsByTagName(this.selector);
    }
  }

  /**
   * Default options
   */
  MoltenLeading.defaultOptions = {
    minline: 1.2,    // Minimum line-height for the element, number (multiplied by the element's font-size)
    maxline: 1.8,    // Maximum line-height for the element, number (multiplied by the element's font-size)
    minwidth: 320,   // Minimum element width where the adjustment starts, pixels
    maxwidth: 1024   // Maximum element width where the adjustment stops, pixels
  };

  /**
   * Shim layer for requestAnimationFrame with setTimeout fallback
   */
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
      function (callback) { window.setTimeout(callback, 1000 / 60); };
  })();

  /**
   * Polyfill bind() for old browsers
   */
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      var aArgs = Array.prototype.slice.call(arguments, 1);
      var fToBind = this;
      var fNOP = function () {};
      var fBound = function () {
        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
               aArgs.concat(Array.prototype.slice.call(arguments)));
      };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }

  MoltenLeading.prototype = {
    constructor : MoltenLeading,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      this.update();
      this._addEventListener(window, "resize", this, false);
    },

    /**
     * Updates leading when needed
     *
     * @function
     */
    update : function () {
      this._forEach(this.elements, this._calcLeading, this);
      this.ticking = false;
    },

    /**
     * Attach this as the event listener
     *
     * @function
     */
    handleEvent : function () {
      this._requestTick();
    },

    /**
    * Calculates the appropriate leading and updates DOM
    *
    * @param  {index} the index of the element
    * @param  {Element} the element to calculate the leading for
    * @return {string} the calculated leading for the element
    * @private
    */
    _calcLeading : function (i, el) {
      var elwidth = el.offsetWidth;
      var widthperc = parseInt((elwidth - this.options.minwidth) / (this.options.maxwidth - this.options.minwidth) * 100, 10);
      var linecalc = this.options.minline + (this.options.maxline - this.options.minline) * widthperc / 100;

      if (widthperc <= 0 || linecalc < this.options.minline) {
        linecalc = this.options.minline;
      } else if (widthperc >= 100 || linecalc > this.options.maxline) {
        linecalc = this.options.maxline;
      }

      el.style.lineHeight = linecalc;
    },

    /**
    * Merge object into target
    *
    * Using copy of the array and item in for loop is FAST:
    * http://jsperf.com/caching-array-length/47
    *
    * @param {target} the object for other objects to be merged into
    * @returns {Object} the merged object (a reference to target)
    * @private
    */
    _extend : function (target) {
      var args = arguments;
      var copyOfArray = [];

      for (var i = 1; i < args.length; i++) {
        var source = args[i];
        for (var property in source) {
          if (source.hasOwnProperty(property)) {
            target[property] = source[property];
          }
        }
      }

      return target;
    },

    /**
     * forEach method
     *
     * @param  {array} array to loop through
     * @param  {function} callback function
     * @param  {object} scope
     * @private
     */
    _forEach : function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    },

    /**
     * Calls rAF if it hasn't been already called,
     * ensuring events don't get stacked
     *
     * @private
     */
    _requestTick : function () {
      if (!this.ticking) {
        requestAnimFrame(this.update.bind(this));
        this.ticking = true;
      }
    },

    /**
     * Adds event listeners
     *
     * @param  {element} the element which the even should be added to
     * @param  {event} the event to be added
     * @param  {function} the function that will be executed
     * @private
     */
    _addEventListener : function (el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        el.addEventListener(evt, fn, bubble);
      } else if ("attachEvent" in el) {
        el.attachEvent("on" + evt, function () {
          // Bind fn as this
          fn.handleEvent.call(fn);
        });
      }
    }

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
  }
  window.moltenLeading = expose;

}(window, document));
