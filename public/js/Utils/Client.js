
/*global
    define
*/

define('PM/Utils/Client', [
    'PM/Core',
    'PM/Utils'
], function (PM, Utils) {
    'use strict';

    var Client = {

        /**
         * Stores Browser infos.
         *
         * Possible values:
         *   > Browser.ie         true if the current browser is internet explorer (any)
         *   > Browser.ie6        true if the current browser is internet explorer 6
         *   > Browser.ie7        true if the current browser is internet explorer 7
         *   > Browser.firefox    true if the current browser is Mozilla/Gecko
         *   > Browser.chrome     true if the current browser is Chrome/Chrommium
         *   > Browser.safari     true if the current browser is Safari/Konqueror
         *   > Browser.opera      true if the current browser is opera
         *   > Browser.webkit     true if the current browser is webkit based and does not match previous one
         *   > Browser.name       the name of the browser
         *   > Browser.version    the version of the browser
         */
        Browser: {
            name: 'unknown',
            version: 0
        },

        /**
         * Stores OS infOS.
         *
         * Possible values:
         *   > OS.mac         true if the OS is mac
         *   > OS.windows     true if the OS is windows
         *   > OS.linux       true if the OS is linux
         *   > OS.webOS       true if the OS is webOS
         *   > OS.iOS         true if the OS is iOS (ipod/iphone/ipad)
         *   > OS.blackberry  true if the OS is blackberry
         *   > OS.android     true if the OS is android
         *   > OS.ipad        true if the OS is ipad
         *   > OS.tablet      true if the OS is tablet
         *   > OS.other       true if the OS is neither mac, windows or linux
         *   > OS.name        is set to the name of the OS
         */
        OS: {
            name: 'unknown'
        }
    };

    /**
     * Populate <Browser> and <OS> properties values.
     *
     * @return {Object} : an Object with browser and version properties.
     */
    function init () {
        var Browser, OS,
            documentElement = document.documentElement,
            ua = navigator.userAgent.toLowerCase(),
            platform = navigator.platform.toLowerCase(),
            UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || ua.match(/(webkit)[\s\/:]([\w\d\.]+)/) || [null, 'unknown', 0],
            mode = UA[1] === 'ie' && document.documentMode,
            version = mode || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2]),
            name = (UA[1] === 'version') ? UA[3] : UA[1];

        // Set current Browser
        Browser = {
            name: name,
            version: version
        };

        // Set Browser[name] to version
        Browser[name] = version;

        // Set Browser[name] && Browser[name + version] to true
        Browser[name + version] = true;

        // Set OS[name] to true for easy check
        OS = {
            name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' :
                    ua.match(/webos|wossystem/) ? 'webos' :
                            ua.match(/blackberry/) ? 'blackberry' :
                                    (ua.match(/android/) || platform.match(/mac|win|linux/) ||
                                            ['other'])[0]
        };

        // Set OS[OS.name] to true
        OS[OS.name] = true;

        Client.Browser = Browser;
        Client.OS = OS;

        // custom css selector (ex: ie ie7 window)
        documentElement.className += ' ' + name + ' ' + name + version + ' ' + OS.name;

        return Client;
    }

    // Init Client
    init();

    return PM.namespace('Client', Client, Utils);
});
