'use strict';

//var appState        = require('classes/appState');
var createQuestion  = require('./classes/createQuestion.js');
var deleteQuestions = require('./classes/deleteQuestions.js');

$(function () {
    createQuestion.init();
    deleteQuestions.init();

    $('#createBtn').trigger('click'); // display create view on page load
});