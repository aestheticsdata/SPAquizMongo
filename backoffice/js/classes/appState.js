'use strict';

var appState = {

    isCreate: false,
    isEdit:   false,
    isDelete: false,

    setState: function (o) {
        this.isCreate = o.isCreate;
        this.isEdit   = o.isEdit;
        this.isDelete = o.isDelete;
    }
};

module.exports = appState;
