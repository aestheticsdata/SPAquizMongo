'use strict';

var signals = require('signals');
var GenericVO = require('./vo/vo.js');

var VS = function () {
    this.vo = new GenericVO();

    this.setVO = function (vo) {
        this.vo.content = vo;
        this.loaded.dispatch();
    };

    this.getVO = function () {
        return this.vo.content;
    };

    this.loaded = new signals.Signal();

    this.getView = function (view) {
        var self = this;

        $.get(view, function (data) {
            self.setVO(data);
//            self.loaded.dispatch();
        });
    };
};

module.exports = VS;

