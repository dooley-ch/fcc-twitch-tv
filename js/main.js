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

    var _channelCache = [];


    /**
     * This function displays an error message at the top of the page
     * 
     * @param {String} caption - The message caption 
     * @param {String} message - The message content
     * 
     * @return {void}
     */
    function _errorMessage(caption, message) {
        var msg = "<div class=\"ui negative message\"><div class=\"header\">" + 
            caption +  "</div><p>" + message + "</p></div><div class=\"hidden ui divider\"></div>";

        $("#messageArea").html(msg);
    }

    /**
     * This function sets the initial state of
     * the channel cache
     * 
     * @param {Array} channelList - array of objects containing channel info 
     */
    function _setupChannelCache (channelList) {
        var nextId = 0;

        _.each(channelList, function(channel) {
            _channelCache.push(
                {
                    linkId: ++nextId,
                    id: 0,
                    name: channel.title.toLowerCase(),
                    isChannelInfoLoaded: false,
                    isStreamInfoLoaded: false,
                    isStreaming: false,
                    isMissing: false,
                    channelInfo: null,
                    streamInfo: null
                }
            );
        });
    }

    /**
     * This function sets the isMissing flag on a channel with the given name
     * 
     * @param {String} name - Then name of the given channel 
     */
    function _markChannelNotFound(name) {
        _.each(_channelCache, function(channel) {
            if (channel.name === name.toLowerCase()) {
                channel.isMissing = true;
            }
        });
    }

    /**
     * This function store the channel info in the cache
     * 
     * @param {Object} data - The channel info 
     */
    function _saveChannelInfo(data) {
        _.each(_channelCache, function(channel) {
            if (channel.name === data.name.toLowerCase()) {
                channel.channelInfo = data;
                channel.isChannelInfoLoaded = true;
            }
        });
    }

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
        var channels = repo.getSearchableChannelList();
        _setupChannelCache(channels);

        keys.getKey(function (errorMessage) {
            _errorMessage("Unable To Obtain API Key", "Reason: " + errorMessage);
        }, function(key) {
            twitchTV.init(key);

            _.each(channels, function(channel) {
                twitchTV.getChannelInfo(channel.title, function(errorMessage) {
                    _errorMessage("TwitchTV - API Failed (" + channel.title + ")", "Unable to obtain channel data: " + errorMessage);
                }, function (data) {
                    if (data) {
                        _saveChannelInfo(data);
                        console.log(_channelCache);
                    } else {
                        _markChannelNotFound(channel.title);
                    }
                });
            });
        });

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
