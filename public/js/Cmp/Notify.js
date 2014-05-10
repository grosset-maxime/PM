
/*global
    define
*/

define('PM/Cmp/Notify', [
    'jquery',

    // PM
    'PM/Core',
    'PM/Cmp/Abstract',

    // Non AMD
    'js!jquery-inherit'
], function ($, PM, Abstract) {
    'use strict';

    var Notify, staticObj;

    var TYPE_ERROR = 'error',
        TYPE_WARNING = 'warning',
        TYPE_INFO = 'info';

    staticObj = {
        /**
         * Message types.
         */
        TYPE_INFO: TYPE_INFO,
        TYPE_WARNING: TYPE_WARNING,
        TYPE_ERROR: TYPE_ERROR
    };

    Notify = $.inherit(Abstract, {

        /**
         * @property {Object} defaultOptions - Default options values.
         */
        defaultOptions: {
            className: '',
            container: null
        },

        /**
         * @constructor Notify.
         * @param {Object} options                - Options values.
         * @param {String} [options.className]    - Class name to add to Cmp.
         */
        __constructor: function (options) {
            var container;
            this.__base(options);

            container = this.options.container;

            if (container) {
                this.inject(container, 'top');
            }
        }, // End function __constructor()

        /**
         * Build the DOM of the Cmp.
         */
        build: function () {
            var ctn, messageCtn,
                that = this,
                els = that.els,
                options = that.options;

            // Main ctn.
            ctn = els.ctn = $('<div>', {
                'class': 'pm_notify_cmp ' + options.className,
                html: $('<div>', {
                    'class': 'close'
                })
            });

            messageCtn = els.messageCtn = $('<div>', {
                'class': 'message-ctn'
            }).appendTo(ctn);
        }, // End function build()

        /**
         * Inject the Cmp into the DOM.
         * @param {Element} element - DOM Element where to inject the Cmp.
         * @param {String}  where   - Position inside the Element.
         */
        inject: function (element, where) {
            this.build();
            this.__base(element, where);
        }, // End function inject()

        /**
         *
         */
        setMessage: function (message, type, display) {
            var els = this.els,
                ctn = els.ctn,
                messageCtn = els.messageCtn;

            ctn.removeClass(TYPE_ERROR + ' ' + TYPE_WARNING + ' ' + TYPE_INFO);

            switch (type) {
            case TYPE_ERROR:
                ctn.addClass(TYPE_ERROR);
                break;
            case TYPE_WARNING:
                ctn.addClass(TYPE_WARNING);
                break;
            case TYPE_INFO:
                ctn.addClass(TYPE_INFO);
                break;
            }

            messageCtn.html(message);

            if (display) {
                this.show();
            }
        } // End function setMessage()
    }, staticObj); // End Class Notify()

    return Notify;
});
