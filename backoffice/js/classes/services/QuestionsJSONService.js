'use strict';

var signals = require('signals');
var jsonVO  = require('./vo/JsonVO.js');

var VS = {
    loaded: new signals.Signal(),

    getJSON: function (url) {
        var self = this;

        $.get(url, function (json) {
            jsonVO.content = json;
            self.loaded.dispatch();
        });
    }
};

module.exports = VS;