define("repository", function (require, exports) {
    "use strict";

    var _ = require("underscore");

    var _defaultList = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "medryBW", "codesurge-xyz"];

    /**
     * This function checks if the users browser supports local storage
     * 
     * @returns {Boolean} - true indicates that local sorage is supported
     */
    function _isLocalStorageAvailable () {
        var test = "test";
        
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    /**
     * This function saves the channel list to local storage
     * 
     * @param {Array} list - List of twitchTV channels of interested to the user 
     * @param {function} fail  - Function to call if the attempt to save fails
     * @param {function} done  - Function to call if the save operatin was successful
     */
    function _saveChannelList(list, fail, done) {
        if (_isLocalStorageAvailable()) {
            var jsonList = JSON.stringify(list);
            localStorage.setItem("channelList", jsonList);
            
            if (_.isFunction(done)) {
                return done();
            }
        }

        if (_.isFunction(fail)) {
            return fail("Local storage not supported.");
        }
    }

    /**
     * This function retreives the channel list from local storage
     * 
     * @param {function} fail - Called if the attempt to load the channel list fails 
     * @returns {Array} - List of channels held in local storage or default list if none found.
     */
    function _getChannelList () {
        if (_isLocalStorageAvailable()) {
            var entry = localStorage.getItem("channelList");

            if (entry) {
                return JSON.parse(entry);
            } else {
                return _defaultList;
            }        
        }

        return _defaultList;
    }

    /**
     * This function converts the standard list of channels into a tuype suitable for use
     * in the search input control
     * 
     * @returns {Array} - list of channels
     */
    function _getSearchableChannelList() {
        var searchList = [];
        var list = _getChannelList();

        _.each(list, function (item) {
            searchList.push({ title: item});
        });

        return searchList;
    }

    /**
     * This function adds a channel to the list in local storage
     * 
     * @param {String} name - Name of channel to add 
     * @param {function} fail - Function to call if addition fails 
     * @param {function} done - Function to call if addition passes
     */
    function _addChannel(name, fail, done) {
        if (_isLocalStorageAvailable()) {
            var list = _getChannelList();

            list.push(name);
            _saveChannelList(list);

            if (_.isFunction(done)) {
                return done();
            }
        }

        if (_.isFunction(fail)) {
            fail("Local storage not supported.");
        }
    }

    /**
     * This function removes a channel from the list in local storage
     * 
     * @param {String} name - The name of the channel to remove 
     * @param {function} fail - Function to call if removal fails 
     * @param {function} done - Function to call if removal passes
     */
    function _removeChannel(name, fail, done) {
        if (_isLocalStorageAvailable()) {
            var list = _getChannelList();
            var removelist = [name];

            var newList = _.difference(list, removelist);

            _saveChannelList(newList);

            if (_.isFunction(done)) {
                return done();
            }
        }

        if (_.isFunction(fail)) {
            fail("Local storage not supported.");
        }
    }

    /**
     * This function restores the test data to it's original state
     * 
     */
    function _reset() {
        _saveChannelList(_defaultList);
    }

    exports.getChannelList = function () {
        return _getChannelList();
    };

    exports.getSearchableChannelList = function () {
        return _getSearchableChannelList();
    };

    exports.saveChannelList = function (list, fail) {
        return _saveChannelList(list, fail);
    };

    exports.addChannel = function (name, fail, done) {
        return _addChannel(name, fail, done);
    };

    exports.removeChannel = function (name, fail, done) {
        return _removeChannel(name, fail, done);
    };

    exports.reset = function () {
        _reset();
    };
});
