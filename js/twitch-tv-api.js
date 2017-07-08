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

    /**
     * This function creates an object literal containing the data related
     * to a channel found as the result of a search
     * 
     * @param {Number} id - The channel id 
     * @param {String} displayName - The display name of the channel 
     * @param {String} logoUrl - The url of the channel's logo 
     * @param {String} name - Channel name 
     * @returns {object} - An object containing the details of a search item 
     */
    function _SearchResultItem(id, displayName, logoUrl, name) {
        return {
            id : id,
            displayName: displayName,
            logoUrl: logoUrl,
            name: name
        };
    }

    /**
     * This function creates an object litral containing the data related to a channel
     * 
     * @param {Number} id - The channel id
     * @param {String} language - Channel language
     * @param {String} displayName  - Display channel name
     * @param {Number} followers - Number of followers
     * @param {String} logoUrl - Url for Logo
     * @param {String} name - Channel Id
     * @param {String} status - Channel status
     * @param {Number} viewers - Number of viewers
     * @param {Date} createdAt - Date channel was created
     * @param {Date} updatedAt - Date channel was last updated
     * @returns {object} - An object containing channel related data
     */
    function _ChannelInfo(id, language, displayName, followers, logoUrl, name, status, views, createdAt, updatedAt) {
        return {
            id: id,
            language: language,
            displayName: displayName,
            followers: followers,
            logoUrl: logoUrl,
            name: name,
            status: status,
            views: views,
            createdAt: createdAt,
            updatedAt: updatedAt
        };
    }

    /**
     * This function creates an object literal containing the data related to a stream
     * 
     * @param {Number} id - Stream id
     * @param {String} game - game name
     * @param {String} viewers - number of viewers
     * @param {String} previewSmallUrl - url for stream image
     * @param {String} previewMediumUrl - url for stream image 
     * @param {String} previewLargeUrl - url for stream image 
     * @returns {object} - Contains stream related data
     */
    function _StreamInfo(id, game, viewers, streamType, previewSmallUrl, previewMediumUrl, previewLargeUrl) {
        return {
            id: id,
            game: game,
            viewers: viewers,
            streamType: streamType,
            previewSmallUrl: previewSmallUrl,
            previewMediumUrl: previewMediumUrl,
            previewLargeUrl: previewLargeUrl 
        };
    }

    /**
     * This function returns details about a given stream
     * 
     * @param {String} name - The channel name or ID 
     * @param {function} fail - Called should the query fail 
     * @param {function} done - Called should the query succeed 
     */
    function _getStreamInfo(name, fail, done) {
        var url = "https://api.twitch.tv/kraken/streams/" + name+ "?client_id=" + _key;

        $.getJSON(url).done(function (data) {
            var info = null;
            var stream = data.stream;

            if (stream) {
                info = _StreamInfo(stream._id, stream.game, stream.viewers, stream.stream_type, stream.preview.small, stream.preview.medium, stream.preview.large);
            }

            if (_.isFunction(done)) {
                done(info);
            }
        }).fail(function(d, textStatus, error) {
            if (_.isFunction(fail)) {
                fail(error);
            }
        });
    }

    /**
     * This function returns details about a given channel
     * 
     * @param {String} name - The channel name or ID 
     * @param {function} fail - Called should the query fail 
     * @param {function} done - Called should the query succeed 
     */
    function _getChannelInfo(name, fail, done) {
        var url = "https://api.twitch.tv/kraken/channels/" + name + "?client_id=" + _key;

        $.getJSON(url).done(function (data) {
            if (_.isFunction(done)) {
                done(_ChannelInfo(
                    data._id,
                    data.language,
                    data.display_name,
                    data.followers,
                    data.logo,
                    data.name,
                    data.status,
                    data.views,
                    new Date(data.created_at),
                    new Date(data.updated_at)    
                ));
            }
        }).fail(function (d, textStatus, error) {
            if (_.isFunction(fail)) {
                fail(error);
            }
        });
    }

    /**
     * This function searches TwitchTV for the given channel
     * 
     * @param {String} criteria - String to search TwitchTV 
     * @param {function} fail - Called should the query fail 
     * @param {function} done - Called should the query succeed 
     */
    function _searchForChannels(criteria, fail, done) {
        var url = "https://api.twitch.tv/kraken/search/channels?query=" + 
            encodeURIComponent(criteria) + "&limit=20&client_id=" + _key;

        $.getJSON(url).done(function (data) {
            var list = [];

            _.each (data.channels, function(item) {
                list.push(_SearchResultItem(item._id, item.display_name, item.logo, item.name));
            });

            if (_.isFunction(done)) {
                done(list);
            }
        }).fail(function (d, textStatus, error) {
            if (_.isFunction(fail)) {
                fail(error);
            }
        });
    }

    exports.init = function (key) {
        _init(key);
    };

    exports.getStreamInfo = function (d, textStatus, error) {
        return _getStreamInfo(d, textStatus, error);
    };

    exports.getChannelInfo = function (name, fail, done) {
        return _getChannelInfo(name, fail, done);
    };

    exports.searchForChannels = function (criteria, fail, done) {
        return _searchForChannels(criteria, fail, done);
    };
});
