'use strict';

var createQuestion  = require('./EditCreateQuestion.js');
var deleteQuestions = require('./deleteQuestions.js');
var config          = require('../config.js');

module.exports = {
    // urls: config.local,
    urls: config.online,
    loginComplete: function() {
        $('#login').empty();
        $('#menuView').show();

        createQuestion.setUrls(this.urls);
        createQuestion.init();

        deleteQuestions.setUrls(this.urls);
        deleteQuestions.init();

        $('#editMode').hide();

        $('#createBtn').trigger('click'); // display create view on page load
    }
}