
/*global
    define
*/

define('PM/Utils', [
    'PM/Core'
], function (PM) {
    'use strict';

    var Utils = {
       /**
        */
        goToUrl: function (url) {
            window.location = url;
        },

        /**
        */
        openUrl: function (url) {
            window.open(url);
        }
    };

    return PM.namespace('Utils', Utils, PM);
});
