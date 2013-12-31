
/*global
    define
*/

define('PM/Class', [
    'jquery',

    // PM
    'PM/Core',

    // NON AMD
    'js!jquery-inherit'
], function ($, PM) {
    'use strict';

    var Class = $.inherit({

        /**
         *
         * @param {Object} options - Options.
         */
        __constructor: function (options) {
            // Set options
            this.setOptions(options);
        },

        /**
         * Set options.
         * @param {Object} options - Options.
         * @return this.
         */
        setOptions: function (options) {
            this.options = $.extend(true, {}, this.defaultOptions, options || {});

            return this;
        },

        /**
         * Set a single option value.
         * @param {String} name - the Option name.
         * @param {Any} value - the Option value.
         * @return this
         */
        setOption: function (name, value) {
            var options = {};
            options[name] = value;
            return this.setOptions(options);
        }
    });

    return PM.namespace('Class', Class, PM);
});

