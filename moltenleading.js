/*!
 * Molten Leading, plain JavaScript version, v1.03
 * https://github.com/viljamis/Molten-Leading
 */
(function (window, document, undefined) {

  "use strict";

  function addEventListener(event, listener) {
    if ("addEventListener" in window) {
      window.addEventListener("resize", listener, false);
    } else if ("attachEvent" in window) {
      window.attachEvent("on" + event, listener);
    }
  }

  /**
   * The MoltenLeading object
   *
   * @param	{String} CSS selector for target elements
   * @param	{Object} MoltenLeading options
   * @constructor
   */
  function MoltenLeading(selector, options) {
    if (!selector) {
      throw new Error("No selector supplied for Molten Leading");
    }

    this.selector = selector;
    this.options = this.extend({}, MoltenLeading.defaultOptions, options);

    // If querySelector is supported, use that
    if ("querySelector" in document && document.querySelector(this.selector)) {
      this.elements = document.querySelectorAll(this.selector);

    // If querySelector is not supported, use getElementsByTagName (for IE7 & 6)
    } else if (document.getElementsByTagName(this.selector)) {
      this.elements = document.getElementsByTagName(this.selector);

    // If element doesn't exists at all, give error
    } else {
      throw new Error("The element you are trying to select doesn't exist");
    }
  }

  /**
   * Default options
   */
  MoltenLeading.defaultOptions = {
    minline: 1.2,    // Minimum line-height for the element
    maxline: 1.8,    // Maximum line-height for the element
    minwidth: 320,   // Minimum element width where the adjustment starts
    maxwidth: 1024,  // Maximum element width where the adjustment stops
    threshold: 50    // Threshold time used on window resize, in milliseconds
  };

  MoltenLeading.prototype = {
    constructor : MoltenLeading,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      var self = this;
      this.resize();
      addEventListener("resize", this.debounce(onResize, this.options.threshold));

      function onResize(e) {
        self.resize(e);
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
      var o = this.options;
      var widthperc = parseInt((el.offsetWidth - o.minwidth) / (o.maxwidth - o.minwidth) * 100, 10);
      var linecalc = o.minline + (o.maxline - o.minline) * widthperc / 100;

      if (widthperc <= 0 || linecalc < o.minline) {
        linecalc = o.minline;
      } else if (widthperc >= 100 || linecalc > o.maxline) {
        linecalc = o.maxline;
      }

      el.style.lineHeight = linecalc;
    },

    /**
     * Handles window resizing and calls `hotlead` when appropriate
     *
     * @function
     */
    resize : function () {
      this.forEach(this.elements, this.hotlead, this);
    },

    /**
    * Merge object into target
    *
    * @param {target} the object for other objects to be merged into
    * @returns {Object} the merged object (a reference to target)
    */
    extend : function (target) {
      var args = arguments;

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
     */
    forEach : function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
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
    debounce : function (func, wait) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          func.apply(context, args);
        }, wait);
      };
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
