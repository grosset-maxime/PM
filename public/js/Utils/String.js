
/*global
    define
*/

define('PM/Utils/String', [
    'PM/Core',
    'PM/Utils'
], function (PM, Utils) {
    'use strict';

    var Strings = {
        /**
         * Convert the String into a Int base 10.
         * @param {String} s - String to convert in Int.
         * @return {Int} Converted String in base 10.
         */
        toInt: function (s) {
            if (!s) {
                return 0;
            }

            return parseInt(s.toString(), 10);
        },

        /**
         *
         */
        ucfirst: function (s) {
            if (!s) {
                return '';
            }

            return s.toString().charAt(0).toUpperCase() + s.substr(1).toLowerCase();
        },

        /**
         * Put each first letter of each words in upper case.
         * @param {String} s - String to put upper case
         *      for each first letter of each words.
         * @return {String} String with each first letter in upper case.
         */
        ucwords: function (s) {
            if (!s) {
                return '';
            }

            return s.toString().replace(
                /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,
                function (l) {
                    return l.toUpperCase();
                }
            );
        }
    };

    return PM.namespace('String', Strings, Utils);
});
