requirejs.config({
    shim : {
        "underscore": {
            exports: "_"
        },        
        metro: {
            deps: ["jquery"]
        }
    },

    paths: {
        jquery: "vendor/jquery-3.2.1.min",
        underscore: "vendor/underscore-1.8.3.min",
        metro: "vendor/metro.min"
    }
});

define("app", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");
    var keys = require("keys");

    require("metro");

    var twitchTV = require("twitch-tv-api");
    var repo = require("repository");

    /**
     * This funtion initializes the application 
     * and displays the weather data on the screen
     * 
     * @return {void}
     */
    function _init() {
        // var channelList = repo.getChannelList();
        // repo.saveChannelList(channelList);

        // repo.addChannel("james");
        // channelList = repo.getChannelList();
        // console.log(channelList);

        // repo.removeChannel("james");
        // channelList = repo.getChannelList();
        // console.log(channelList);
        
        // channelList = repo.getChannelList();

        keys.getKey(function(errorMessage) {
            console.log(errorMessage);
        }, function (key) {
            twitchTV.init(key);
        });

        // var channelStatus = twitchTV.getChannelStatus("riotgames");
        // console.log(channelStatus);

        // var channelInfo = twitchTV.getChannelInfo("riotgames");
        // console.log(channelInfo);
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
