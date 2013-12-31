
/*global
    define
*/

define('PM/Core', [

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
         * @param {String} namespace - Namespace name.
         * @param {Object} value     - Namespace new value.
         * @param {Object} root      - Object that will store the namespace (default: window).
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
