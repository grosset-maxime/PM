
/*global
    define
*/

define('PM/Core/Core', [

], function () {
    'use strict';

    var Core,

        /**
         *
         */
        debug = false;

    Core = {

        /**
         */
        setDebug: function (bool) {
            debug = !!bool;
        },

        /**
         */
        getDebug: function () {
            return debug;
        },

        /**
         * Log a message to a console, if one available.
         *
         * @param {any} a - Message to log.
         *
         * Example:
         *  (start code)
         *  PM.log('Hello World !!');
         *  (end code)
         */
        log: function (a) {
            if (!debug) {
                return;
            }

            if (window.console) {
                window.console.log(a);
            } else if (window.opera && window.opera.postError) {
                window.opera.postError(a);
            }
        },

        /**
         *
         */
        logAjaxFail: function (jqXHR, textStatus, errorThrown, message) {
            this.log('Ajax request fail :');
            this.log(message || '');
            this.log(jqXHR);
            this.log(textStatus);
            this.log(errorThrown);
        },

        /**
         * @param {String} m - Message to alert.
         */
        alert: function (m) {
            if (debug && window.alert) {
                window.alert(m);
            }
        },

        /**
         * Store value argument into root argument using namespace argument has property name.
         *
         * If the extend argument is undefined or false and the namespace is exist, it will
         * throw an Error, or if extend is true it will recursively extend
         * the existing value using <PM.extend>.
         *
         * @param {String}  namespace - Namespace name.
         * @param {Object}  value     - Namespace new value.
         * @param {Object}  root      - Object that will store the namespace (default: window).
         * @param {Boolean} extend    - If true it will extend the existing namespace
         *                              else it will trigger an Error if exist (default: false).
         *
         * @return {Object} namespace - New namespace.
         *
         * Example:
         *   (start code)
         *   // Create a namespace
         *   PM.namespace('MyProject', {
         *       myString: 'MyProject',
         *       myValues: [],
         *       myMethod: function () {}
         *   });
         *
         *   // Create a sub namespace
         *   PM.namespace('MyProject/Utils/Tests', {
         *       myString: 'MyProject/Utils/Tests'
         *   });
         *
         *   // Extend a sub namespace
         *   PM.namespace('MyProject/Utils', {
         *       myString: 'MyProject/Utils'
         *   });
         *   (end code)
         *
         * Note:
         *  - http://blogger.ziesemer.com/2007/10/respecting-javascript-global-namespace.html
         *  - http://www.zachleat.com/web/yui-code-review-yahoonamespace/
         *  - http://www.yuiblog.com/blog/2007/06/12/module-pattern/
         *  - https://developer.mozilla.org/en/XUL_School/JavaScript_Object_Management
         */
        namespace: function (namespace, value, root) {
            root = root || window;

            var i, l, hasOwn, message,
                namespaces = namespace.split('/');

            for (i = 0, l = namespaces.length; i < l; i++) {

                namespace = namespaces[i];
                hasOwn = !!(root[namespace]);

                // Last namespace part
                if (i === (l - 1)) {
                    if (hasOwn) {
                        message = 'Duplicate NameSpace "' + namespaces.join('.') + '" into "' + root + '"';
                        Core.log(message);
                        throw new Error(message);
                    } else {
                        root[namespace] = value;
                    }
                } else if (!hasOwn) {
                    root[namespace] = {};
                }

                root = root[namespace];
            }

            return value;
        }
    };

    return Core.namespace('PM', Core, window);
});
