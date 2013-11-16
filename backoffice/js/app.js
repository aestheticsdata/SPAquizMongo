'use strict';

var createQuestion  = require('./classes/EditCreateQuestion.js');
var deleteQuestions = require('./classes/deleteQuestions.js');

$(function () {
    createQuestion.init();
    deleteQuestions.init();

    $('#editMode').hide();

    $('#createBtn').trigger('click'); // display create view on page load
});