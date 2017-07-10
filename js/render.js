define("render", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");

    var _compileCardContainer;
    var _compileChannelInfoCard;
    var _compileLoadingCard;
    var _compileStreamInfoCard;
    var _compileDeletedCard;

    /**
     * Compiles the templates once for use in displaying 
     * the content
     */
    function _initTemplates () {
        // ChannelInfo Card
        var template = $("#channelInfoCardTemplate").html();
        _compileChannelInfoCard = _.template(template);

        // StreamInfo Card
        template = $("#streamInfoCardTemplate").html();
        _compileStreamInfoCard = _.template(template);
        
        // Deleted Card
        template = $("#missingCardTemplate").html();
        _compileDeletedCard = _.template(template);

        // Loading Card
        template = $("#loadingCardTemplate").html();
        _compileLoadingCard = _.template(template);

        // Card Container
        template = $("#cardsContainerTemplate").html();
        _compileCardContainer = _.template(template);
    }

    /**
     * Extracts the channel data needed for displaying in the browser
     * 
     * @param {Object} channel - The channel to parse 
     * 
     * @returns {Object} - Data needed for display
     */
    function _parseChannelInfo(channel, trashButtonId, linkButtonId) {
        var imgUrl = "img/logo.png";

        if (channel.channelInfo.logo) {
            imgUrl = channel.channelInfo.logo;
        }

        var data = {
            name: channel.name,
            displayName: channel.channelInfo.displayName,
            logo: imgUrl,
            status: channel.channelInfo.status,
            followers: Number(channel.channelInfo.followers).toLocaleString(),
            views: Number(channel.channelInfo.views).toLocaleString(),
            trashButtonId: trashButtonId,
            linkButtonId: linkButtonId
        };

        return data;
    }

    /**
     * Extracts the stream data needed for displaying in the browser
     * 
     * @param {Object} channel - The channel to parse 
     * 
     * @returns {Object} - Data needed for display
     */
    function _parseStreamInfo(channel, trashButtonId, linkButtonId) {
        var imgUrl = "img/logo.png";

        if (channel.channelInfo.logo) {
            imgUrl = channel.channelInfo.logo;
        }

        var data = {
            name: channel.name,
            displayName: channel.channelInfo.displayName,
            logo: imgUrl,
            game: channel.streamInfo.game,
            preview: channel.streamInfo.preview, 
            viewers: Number(channel.streamInfo.viewers).toLocaleString(),
            trashButtonId: trashButtonId,
            linkButtonId: linkButtonId
        };

        return data;
    }

    /**
     * Extracts the channel data needed for displaying in the browser
     * 
     * @param {Object} channel - The channel to parse 
     * 
     * @returns {Object} - Data needed for display
     */
    function _parseLoadingInfo(channel) {
        return {
            linkId: channel.linkId, 
            displayName: channel.rawName
        };
    }

    function _displaySingleCard(channel) {
        if (!channel) {
            return;
        }

        if (!_compileChannelInfoCard) {
            _initTemplates();
        }
    }

    /**
     * Displays all channels in the browser in a loading state
     * 
     * @param {Array} channels - Channels to display
     * 
     * @returns {void}
     */
    function _showLoadingView(channels) {
        if (!_compileChannelInfoCard) {
            _initTemplates();
        }

        var cards = [];

        _.each(channels, function (channel) {
            cards.push(_compileLoadingCard(_parseLoadingInfo(channel)));
        });

        var html = _compileCardContainer({cards: cards.join()});

        $("#cardsContainer").html(html);
    }

    /**
     * Displays the given channel on the grid
     * 
     * @param {Object} channel - The channel to display 
     * 
     * @returns {void}
     */
    function _displayCard(channel, trashIt, linkIt) {
        if (!channel.isChannelInfoLoaded || !channel.isStreamInfoLoaded) {
            return;
        }

        if (!_compileChannelInfoCard) {
            _initTemplates();
        }

        var card = $("#" + channel.linkId);
        var html = "";

        var trashButtonId = _.uniqueId("trashButton_");
        var linkButtonId = _.uniqueId("linkButton_");

        // Clear any visual effects associated with the card as whole
        card.removeClass("red");
        card.removeClass("green");
        card.removeClass("raised");

        if (channel.isMissing) {
            html = _compileDeletedCard({
                name: channel.name,
                trashButtonId: trashButtonId,
                displayName: channel.rawName
            });
            card.addClass("red");
        } else {
            if (channel.isStreaming) {
                html = _compileStreamInfoCard(_parseStreamInfo(channel, trashButtonId, linkButtonId));
                card.addClass("raised green");
            } else {
                html = _compileChannelInfoCard(_parseChannelInfo(channel, trashButtonId, linkButtonId));
            }
        }
             
        card.html(html);

        // Set the click callbacks
        $("#" + trashButtonId).click(function(e) { 
            if (_.isFunction(trashIt)) {
                trashIt(e);
            }
        });

        $("#" + linkButtonId).click(function(e) { 
            if (_.isFunction(linkIt)) {
                linkIt(e);
            }
        });
    }

    exports.showLoadingView = function (channels) {
        return _showLoadingView(channels);
    };

    exports.displayCard = function (channel, trashIt, linkId) {
        return _displayCard(channel, trashIt, linkId);
    };

    exports.displaySingleCard = function (channel) {
        return _displaySingleCard(channel);
    };
});
