'use strict';

var signals = require('signals');
var EditCreateVO = require('./vo/EditCreateViewVO.js');
var DeleteVO = require('./vo/DeleteViewVO.js');

var VS = {

    loaded: new signals.Signal(),

    getView: function (view) {
        var self = this;

        $.get(view, function (data) {
            if(view.search('create')) {
                EditCreateVO.content = data;
            }
            if(view.search('delete')) {
                DeleteVO.content = data;
            }
            self.loaded.dispatch();
        });
    }
};

module.exports = VS;

