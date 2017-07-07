define("twitch-tv-api", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");

    var _key;

    /**
     * This function initializes the module by storing the API key
     * 
     * @param {String} key - The key to use in api calls 
     */
    function _init(key) {
        _key = key;
    }

    function _getChannelStatus(id) {
        var url = "https://api.twitch.tv/kraken/streams/" + id + "?client_id=" + _key;

        $.getJSON(url).done(function (data) {
            console.log(data);
        });

        return "";
    }

    function _getChannelInfo(id) {
        var url = "https://api.twitch.tv/kraken/channels/" + id + "?client_id=" + _key;

        $.getJSON(url).done(function (data) {
            console.log(data);
        });

        return "";
    }

    exports.init = function (key) {
        _init(key);
    };

    exports.getChannelStatus = function (id) {
        return _getChannelStatus(id);
    };

    exports.getChannelStatus = function (id) {
        return _getChannelStatus(id);
    };

    exports.getChannelInfo = function (id) {
        return _getChannelInfo(id);
    };
});
