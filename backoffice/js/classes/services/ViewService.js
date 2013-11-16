'use strict';

var signals = require('signals');

var VS = {
    vw: '',

    loaded: new signals.Signal(),

    getView: function (view) {
        var self = this;
        $.get(view, function (data) {
            self.vw = data;
            self.loaded.dispatch();
        });
    }
};

module.exports = VS;

