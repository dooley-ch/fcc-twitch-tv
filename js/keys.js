define("keys", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");

    /**
     * This function provides a valid TwitchTV API key for use in the applicaiton
     * 
     * @param {function} fail - invoked if the function is unable to obtain a valid key 
     * @param {any} done - invoked to return a valid key to the caller
     */
    function _getKey (fail, done) {
        $.getJSON("data/keys.json").done(function (dataArray) {
            var index = Math.floor(Math.random() * (dataArray.length - 1)) + 1;
            done(dataArray[index]);
        }).fail(function (d, textStatus, error) {
            if (_.isFunction(fail)) {
                fail("Unable to get API key: " + error);
            }
        });    
    }

    exports.getKey = function (fail, done) {
        return _getKey(fail, done);
    };
});
