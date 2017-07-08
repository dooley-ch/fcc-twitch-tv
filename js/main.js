requirejs.config({
    shim : {
        "underscore": {
            exports: "_"
        },
        semantic: {
            deps : ["jquery"]
        }
    },

    paths: {
        jquery: "vendor/jquery-3.2.1.min",
        underscore: "vendor/underscore-1.8.3.min",
        semantic: "vendor/semantic.min"
    }
});

define("app", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");

    require("semantic");
    
    var keys = require("keys");
    var twitchTV = require("twitch-tv-api");
    var repo = require("repository");

    function _showSingleCard(name) {
        alert(name);
    }

    function _changeFilter(filter) {
        alert("Change filter: " + filter);
    }

    function _getNewChannelFromUser() {
        alert("Get new channel");
    }

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
            // twitchTV.searchForChannels("freecodecamp", function (error) {
            //     console.log(error); }, function (data) {
            //     console.log(data);});

            // twitchTV.getChannelInfo("riotgames", function (error) {
            //     console.log(error);
            // }, function(data) {
            //     console.log(data);
            // });

            // twitchTV.getStreamInfo("OgamingSC2", function (error) {
            //     console.log(error);
            // }, function(data) {
            //     if (data) {
            //         console.log(data);
            //     }
            // });
        });

        // var channelStatus = twitchTV.getChannelStatus("riotgames");
        // console.log(channelStatus);

        // var channelInfo = twitchTV.getChannelInfo("riotgames");
        // console.log(channelInfo);

        // Set up filter
        $("#filterMenu").dropdown({
            action: "activate",
            onChange: function (value) {
                _changeFilter(value);
            }
        }); 

        // Setup search
        var channels = repo.getSearchableChannelList();
        $("#searchInput").search({
            source : channels,
            searchFields   : [ "title"],
            searchFullText: false,
            onSelect: function (result) {
                _showSingleCard(result.title);
            }
        });

        // Setup the add channel button
        $("#addChannelButton").click(function (){
            _getNewChannelFromUser();
        });
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();


});
