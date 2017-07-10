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
        semantic: "vendor/semantic.min",
        dot: "vendor/dot.min"
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
    var render = require("render");

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
     * This function gets a channel info reference from the cache
     * 
     * @param {String} name - the channel name 
     */
    function _getChannel (name) {
        for (var i = 0; i < _channelCache.length; i++) {
            if (_channelCache[i].name === name.toLowerCase()) {
                return _channelCache[i];
            }
        } 

        return null;
    }

    function _scrubChannelInfo(channel) {
        if (!channel.logo) {
            channel.logo = "img/logo.png";
        }
    }

    /**
     * This function performs the initial load
     * 
     * @return {void}
     */
    function _doInitialLoad() {
        keys.getKey(function (errorMessage) {
            _errorMessage("Unable To Obtain API Key", "Reason: " + errorMessage);
        }, function(key) {
            twitchTV.init(key);

            _.each(_channelCache, function(channel) {
                twitchTV.getChannelInfo(channel.name, function(errorMessage) {
                    _errorMessage("TwitchTV - API Failed (" + channel.name + ")", "Unable to obtain channel data: " + errorMessage);
                }, function (data) {
                    if (data) {
                        _scrubChannelInfo(data);
                        
                        channel.channelInfo = data;
                        channel.isChannelInfoLoaded = true;

                        render.displayChannel(channel);
                    } else {
                        channel.isMissing = true;
                        channel.isChannelInfoLoaded = true;

                        render.displayChannel(channel);
                    }
                });

                twitchTV.getStreamInfo(channel.title, function(errorMessage) {
                    _errorMessage("TwitchTV - API Failed (" + channel.name + ")", "Unable to obtain stream data: " + errorMessage);
                }, function (data) {
                    if (data) {
                        channel.streamInfo = data;
                        channel.isStreamInfoLoaded = true;
                        channel.isStreaming = true;

                        render.displayChannel(channel);
                    } else {
                        channel.isStreamInfoLoaded = true;
                        render.displayChannel(channel);
                    }
                });                
            });
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
        render.showLoadingView(_channelCache);

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

        // Setup the initial load
        setTimeout(_doInitialLoad, 1000);
    }

    exports.init = function () {
        _init();
    };
});

requirejs(["app"], function (app) {
    "use strict";
    app.init();
});
