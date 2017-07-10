define("render", function (require, exports) {
    "use strict";

    var $ = require("jquery");
    var _ = require("underscore");
    var doT = require("dot");

    var _buildLoadingCard = doT.template(
        "<div id=\"card_{{=it.linkId}}\" class=\"card\"><div class=\"content\"><img class=\"right floated small bordered ui image\" src=\"img/logo.png\">" +
            "<div class=\"header\">{{=it.name}}</div><div class=\"meta\"></div><div class=\"description\"><div class=\"ui active dimmer\">" +
            "<div class=\"content\"><div class=\"center\"><div class=\"ui text loader\">Loading</div></div></div></div><p><span class=\"right floated\">" +
            "<i class=\"users icon\"></i></span><i class=\"line chart icon\"></i></p></div></div><div class=\"extra content\"><button class=\"ui icon red button\">" +
            "<i class=\"trash icon\"></i></button><button class=\"right floated ui icon olive button\"><i class=\"external square icon\"></i></button></div></div>"
    );

    var _buildMissingCard = doT.template(
        "<div id=\"card_{{=it.linkId}}\" class=\"card red\"><div class=\"content\"><img class=\"right floated small bordered ui image\" src=\"img/logo.png\">" +
            "<div class=\"header\">{{=it.name}}</div><div class=\"center aligned description\"><div class=\"ui icon tiny header\"><i class=\"trash icon\"></i>" +
            "<div class=\"content\">Channel Not Found<div class=\"sub header\">This channel is no longer available.</div></div></div></div></div>" +
            "<div class=\"extra content\"><button class=\"ui icon red button\"><i class=\"trash icon\"></i></button></div></div>"
    );

    var _buildChannelCard = doT.template(
        "<div id=\"card_{{=it.linkId}}\" class=\"card\"><div class=\"content\"><img class=\"right floated small bordered ui image\" src=\"{{=it.channelInfo.logo}}\">" +
            "<div class=\"header\">{{=it.channelInfo.displayName}}</div><div class=\"meta\">{{it.channelInfo.status}}</div><div class=\"description\"><p><span class=\"right floated\">" +
            "<i class=\"users icon\"></i>{{=it.channelInfo.followers}} followers</span><i class=\"line chart icon\"></i>{{=it.channelInfo.views}} views</p></div></div>" +
            "<div class=\"extra content\"><button class=\"ui icon red button\"><i class=\"trash icon\"></i></button>" +
            "<button class=\"right floated ui icon olive button\"><i class=\"external square icon\"></i></button></div></div>"
    );

    var _buildStreamingCard = doT.template(
        "<div id=\"card_{{=it.linkId}}\" class=\"card\"><div class=\"content\"><div class=\"right floated meta\">streaming</div>" +
            "<img class=\"ui avatar image\" src=\"{{=it.channelInfo.logo}}\">{{=it.channelInfo.displayName}}</div><div class=\"image\">" +
            "<img src=\"{{=it.streamingInfo.previewUrl}}\"></div><div class=\"content\"><div class=\"description\"><p class=\"ui tiny header\">" +
            "{{=it.streaming.game}}</p><p><span class=\"right floated\"><i class=\"users icon\"></i>{{=it.streamingInfo.viewers}} viewers</span></p>" +
            "</div></div><div class=\"extra content\"><button class=\"ui icon red button\"><i class=\"trash icon\"></i></button>" +
            "<button class=\"right floated ui icon olive button\"><i class=\"external square icon\"></i></button></div></div>"
    );

    function _showLoadingView(channels) {
        var html = "<div class=\"ui cards\">";

        _.each(channels, function(channel) {
            html += _buildLoadingCard(channel);
        });

        html += "</div>";

        $("#cardsContainer").html(html);
    }

    function _displayChannel(channel) {
        if (!channel.isChannelInfoLoaded || !channel.isStreamInfoLoaded) {
            return;
        }

        var html = "";

        if (channel.isMissing) {
            html = _buildMissingCard(channel);
        } else {
            if (channel.isStreaming) {
                html = _buildStreamingCard(channel);
            } else {
                html = _buildChannelCard(channel);
            }
        }
             
        $("#card_" + channel.linkId).html(html);
    }

    exports.showLoadingView = function (channels) {
        return _showLoadingView(channels);
    };

    exports.displayChannel = function (channel) {
        return _displayChannel(channel);
    };
});
