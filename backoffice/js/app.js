'use strict';

var createQuestion  = require('./classes/EditCreateQuestion.js');
var deleteQuestions = require('./classes/deleteQuestions.js');
var config          = require('./config.js');

$(function () {
    var urls = config.local;

    createQuestion.setUrls(urls);
    createQuestion.init();

    deleteQuestions.setUrls(urls);
    deleteQuestions.init();

    $('#editMode').hide();

    $('#createBtn').trigger('click'); // display create view on page load
});