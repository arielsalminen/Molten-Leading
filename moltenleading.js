/*!
 * Molten Leading, plain JavaScript version, v1.01
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
    minline: 1.2,   // Minimum line-height for the element
    maxline: 1.8,   // Maximum line-height for the element
    minwidth: 320,  // Minimum element width where the adjustment starts
    maxwidth: 1024  // Maximum element width where the adjustment stops
  };

  MoltenLeading.prototype = {
    constructor : MoltenLeading,

    /**
     * Intializes the instance
     *
     * @function
     */
    init : function () {
      this.forEach(this.elements, this.hotlead, this);
      this.addEvent(window, "resize", this, false);
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
      this.debounce(function () {
        this.forEach(this.elements, this.hotlead, this);
      }, 100);
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
    * Debounce returns a function, that, as long as it continues to be invoked,
    * will not be triggered. The function will be called after it stops being
    * called for N milliseconds.
    */
    debounce : function (func, wait) {
      var timeout;
      var context = this;
      var later = function () {
        timeout = null;
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      func.apply(context, arguments);
    },

    /*
    * Handles events in a way that they work in all browsers
    *
    * fn arg can be an object or a function, thanks to handleEvent
    * read more at: http://www.thecssninja.com/javascript/handleevent
    *
    * @param	{Element} the element to add the eventListener for
    * @param	{string}  the eventListener which should be added
    * @param	{string}	the context that should be passed
    * @param	{boolean} event bubbling, true or false
    */
    addEvent : function (el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        try {
          el.addEventListener(evt, fn, bubble);

        // BBOS6 doesn't support handleEvent, catch and polyfill
        } catch (e) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.addEventListener(evt, function (e) {

              // Bind fn as this and set first arg as event object
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
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
    * Handling the events
    *
    * @param  {event} event
    * @return {function} Returns appropriate function to be used with the event
    */
    handleEvent : function (event) {
      var evt = event || window.event;

      switch (evt.type) {
      case "resize":
        this.resize(evt);
        break;
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
