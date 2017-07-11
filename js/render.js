define("render", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");

    var _compileCardContainer;
    var _compileCenteredCardContainer;
    var _compileCardHolder;

    var _compileChannelInfoCard;
    var _compileLoadingCard;
    var _compileStreamInfoCard;
    var _compileDeletedCard;

    var _compileMessage;

    /**
     * Compiles the templates once for use in displaying 
     * the content
     */
    function _initTemplates () {
        var template;

        // Success message 
        template = $("#messsageTemplate").html();
        _compileMessage = _.template(template);

        // ChannelInfo Card
        template = $("#channelInfoCardTemplate").html();
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

        // Centered Card Container
        template = $("#centeredCardContainerTemplate").html();
        _compileCenteredCardContainer = _.template(template);

        // Card holder
        template = $("#cardContentHolderTemplate").html();
        _compileCardHolder = _.template(template);
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

        var content;
        var actionClass = "";

        var trashButtonId = _.uniqueId("trashButton_");
        var linkButtonId = _.uniqueId("linkButton_");

        if (channel.isMissing) {
            content = _compileDeletedCard({
                name: channel.name,
                trashButtonId: trashButtonId,
                displayName: channel.rawName
            });
            actionClass = "red";
        } else {
            if (channel.isStreaming) {
                content = _compileStreamInfoCard(_parseStreamInfo(channel, trashButtonId, linkButtonId));
                actionClass = "raised green";
            } else {
                content = _compileChannelInfoCard(_parseChannelInfo(channel, trashButtonId, linkButtonId));
            }
        }
        
        var html = _compileCenteredCardContainer({actionClass: actionClass, cardContent: content});
        $("#cardsContainer").html(html);
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

        var html = _compileCardContainer({cards: cards.join("")});

        $("#cardsContainer").html(html);
    }

    /**
     * Displays the given channel on the grid
     * 
     * @param {Object} channel - The channel to display 
     * 
     * @returns {void}
     */
    function _displayCardContent(channel, trashIt, linkIt) {
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

    function _reDisplayCards(channels) {
        var cardsHtml = [];

        _.each(channels, function(channel) {
            var content = "";
            var actionClass = "";

            var trashButtonId = _.uniqueId("trashButton_");
            var linkButtonId = _.uniqueId("linkButton_");

            if (channel.isMissing) {
                content = _compileDeletedCard({
                    name: channel.name,
                    trashButtonId: trashButtonId,
                    displayName: channel.rawName
                });
                actionClass = "red";
            } else {
                if (channel.isStreaming) {
                    content = _compileStreamInfoCard(_parseStreamInfo(channel, trashButtonId, linkButtonId));
                    actionClass = "raised green";
                } else {
                    content = _compileChannelInfoCard(_parseChannelInfo(channel, trashButtonId, linkButtonId));
                }
            }

            var html = _compileCardHolder({linkId: channel.linkId, actionClass: actionClass, content: content});
            cardsHtml.push(html);
        });

        var html = _compileCardContainer({cards: cardsHtml.join("")});

        $("#cardsContainer").html(html);
    }

    function _deleteCard(channel) {
        $("#" + channel.linkId).hide();
    }

    function _displaySuccessMessage(title, message) {
        var html = _compileMessage({title: title, messageType: "success", message: message});

        $("#messageArea").html(html);

        $(".message .close").on("click", function() {
            $(this).closest(".message").transition("fade");
        });
    }

    function _displayFailedMessage(title, message) {
        var html = _compileMessage({title: title, messageType: "negative", message: message});

        $("#messageArea").html(html);

        $(".message .close").on("click", function() {
            $(this).closest(".message").transition("fade");
        });
    }

    exports.showLoadingView = function (channels) {
        return _showLoadingView(channels);
    };

    exports.displayCardContent = function (channel, trashIt, linkId) {
        return _displayCardContent(channel, trashIt, linkId);
    };

    exports.displaySingleCard = function (channel) {
        return _displaySingleCard(channel);
    };

    exports.reDisplayCards = function (channels) {
        return _reDisplayCards(channels);
    };

    exports.deleteCard = function (channel) {
        return _deleteCard(channel);
    };

    exports.displaySuccessMessage = function (title, message) {
        return _displaySuccessMessage(title, message);
    };

    exports.displayFailedMessage = function (title, message) {
        return _displayFailedMessage(title, message);
    };
});
