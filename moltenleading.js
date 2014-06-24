/*!
 * Molten Leading, plain JavaScript version, v1.03
 * https://github.com/viljamis/Molten-Leading
 */
(function (window, document, undefined) {

  "use strict";

  /**
   * The MoltenLeading object
   *
   * @param	{String} CSS selector for target elements
   * @param	{Object} MoltenLeading options
   * @constructor
   */
  function MoltenLeading(selector, options) {
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
    minline: 1.2,    // Minimum line-height for the element, numbers (multiplied by the element's font-size)
    maxline: 1.8,    // Maximum line-height for the element, numbers (multiplied by the element's font-size)
    minwidth: 320,   // Minimum element width where the adjustment starts, pixels
    maxwidth: 1024,  // Maximum element width where the adjustment stops, pixels
    threshold: 100   // Threshold time used on window resize, milliseconds
  };

  MoltenLeading.prototype = {
    constructor : MoltenLeading,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      this.resize();
      this._addEventListener("resize", this._debounce(onResize, this.options.threshold));

      var self = this;
      function onResize(event) {
        self.resize(event);
      }
    },

    /**
    * Calculates the appropriate leading
    *
    * @param	{index} the index of the element
    * @param	{Element} the element to calculate the leading for
    * @return {string} the calculated leading for the element
    */
    hotlead : function (i, el) {
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
     * Handles window resizing and calls `hotlead` when appropriate
     *
     * @function
     */
    resize : function () {
      this._forEach(this.elements, this.hotlead, this);
    },

    /**
    * Merge object into target
    *
    * Using copy of the array and item in for loop is FAST:
    * http://jsperf.com/caching-array-length/47
    *
    * @param {target} the object for other objects to be merged into
    * @returns {Object} the merged object (a reference to target)
    */
    _extend : function (target) {
      var args = arguments;
      var copyOfArray = [];

      for (var i = 0, item; item = args[i]; i++) {
        var source = copyOfArray[i] = item;
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
     */
    _forEach : function (array, callback, scope) {
      var copyOfArray = [];
      for (var i = 0, item; item = array[i]; i++) {
        callback.call(scope, i, copyOfArray[i] = item);
      }
    },

    /**
     * Debounce returns a function, that, as long as it continues to be invoked,
     * will not be triggered. The function will be called after it stops being
     * called for N milliseconds.
     *
     * @param  {function} callback function
     * @param  {integer} milliseconds to wait
     */
    _debounce : function (func, wait) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          func.apply(context, args);
        }, wait);
      };
    },

    /**
     * Adds event listeners
     *
     * @param  {event} the event to be added
     * @param  {function} the function that will be executed
     */
    _addEventListener : function (event, listener) {
      if ("addEventListener" in window) {
        window.addEventListener("resize", listener, false);
      } else if ("attachEvent" in window) {
        window.attachEvent("on" + event, listener);
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
