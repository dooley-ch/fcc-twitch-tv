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
        var msg = "<div class=\"ui negative compact message\"><div class=\"header\">" + 
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
        _.each(channelList, function(channel) {
            _channelCache.push(
                {
                    linkId: _.uniqueId("card_"),
                    id: 0,
                    name: channel.title.toLowerCase(),
                    rawName: channel.title,
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

    function _onTrashCanClicked(e) {
        var channelName = e.currentTarget.dataset["card"];

        if (channelName) {
            alert("Need to delete card: " + channelName);
        } else {
            alert("Screwed again.");
        }
    }

    function _onLinkClicked(e) {
        var channelName = e.currentTarget.dataset["card"];

        if (channelName) {
            var channel = _getChannel(channelName);

            if (channel) {
                window.open(channel.channelInfo.url);
            }
        }
    }

    /**
     * This function gets a channel info reference from the cache
     * 
     * @param {String} name - the channel name 
     */
    function _getChannel (name) {
        return _.find(_channelCache, function(channel) {
            return channel.name === name.toLowerCase();
        });
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
                    var msg = "Unable to obtain channel data";

                    if (errorMessage) {
                        msg = msg + ": " + errorMessage;
                    }

                    _errorMessage("TwitchTV - API Failed (" + channel.name + ")", msg);
                }, function (data) {
                    if (data) {                        
                        channel.channelInfo = data;
                        channel.isChannelInfoLoaded = true;

                        render.displayCard(channel, _onTrashCanClicked, _onLinkClicked);
                    } else {
                        channel.isMissing = true;
                        channel.isChannelInfoLoaded = true;

                        render.displayCard(channel, _onTrashCanClicked, _onLinkClicked);
                    }
                });

                twitchTV.getStreamInfo(channel.name, function(errorMessage) {
                    var msg = "Unable to obtain stream data";

                    if (errorMessage) {
                        msg = msg + ": " + errorMessage;
                    }

                    _errorMessage("TwitchTV - API Failed (" + channel.name + ")", msg);
                }, function (data) {
                    if (data) {
                        channel.streamInfo = data;
                        channel.isStreamInfoLoaded = true;
                        channel.isStreaming = true;

                        render.displayCard(channel, _onTrashCanClicked, _onLinkClicked);
                    } else {
                        channel.isStreamInfoLoaded = true;
                        render.displayCard(channel, _onTrashCanClicked, _onLinkClicked);
                    }
                });                
            });
        });
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
                render.displaySingleCard(_getChannel(result.title));
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
