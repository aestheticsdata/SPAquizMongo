'use strict';

var KeepScope = function (){
    this.save = function (listener, context, event) {
        return function () {
            listener.call(context, event);
        };
    };
};

module.exports = KeepScope;