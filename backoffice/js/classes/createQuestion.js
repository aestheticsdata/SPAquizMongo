'use strict';

var appState = require('./appState.js');

var createQuestion = {
    init: function () {
        $('#createBtn').on('click', function (e) {
            if(!appState.isCreate) {
                $('#deleteBtn').removeClass('selectedBtn');
                $('#editBtn').removeClass('selectedBtn');
                $(this).addClass('selectedBtn');

                appState.isCreate = true;
                appState.isEdit   = false;
                appState.isDelete = false;

                $('#editMode').hide();

                $.get('./views/create.html', function (data) {
                    $('#view')
                        .empty()
                        .append(data);

                    // TODO add a js-signals to be sure this part is added safely after the append(data) or Backbone.Event
                    var $addButton       = $('#addButton'),
                        $removeButton    = $('#removeButton'),
                        $choiceContainer = $('#choiceContainer'),
                        $choice          = $('.choice'),
                        choiceLength     = $choice.length,
                        $logMessage      = $('#logMessage');

                    if (true) { // change true: true is in create mode when mergin createQuestion.js and editQuestion.js
                        $choiceContainer.append('' +
                            '<div class="singleChoiceContainer">' +
                                '<label class="control-label">choice 1: </label>' +
                                '<input type="text" name="choices" class="input-xxlarge choice"></input>' +
                                '<input type="radio" name="correctAnswer" class="radio" value="0" checked="true"></input>' +
                            '</div>');
                    }

                    $addButton.on('click', function (e) {
                        choiceLength = $('.choice').length;
                        var choiceInputField = '<div class="singleChoiceContainer"><label>choice '+(choiceLength+1)+': </label><input type="text" name="choices" class="input-xxlarge choice" ></input><input type="radio" class="radio" value="'+choiceLength+'" name="correctAnswer"></input></div>';

                        e.preventDefault();

                        $choiceContainer.append(choiceInputField);
                    });

                    $removeButton.on('click', function (e) {
                        e.preventDefault();
                        if ($('.singleChoiceContainer').length > 1) {
                            $('.singleChoiceContainer').last().remove();
                        }
                    });

                    $('#questionForm').submit(function (e) {
                        e.preventDefault();
                        var serializedForm = $(this).serialize();
                        $.post('http://127.0.0.1:8765/questions', serializedForm)
                            .done(function () {
                                $logMessage
                                    .text('question inserted into DB')
                                    .delay(800)
                                    .fadeOut(200);
                                $('#questionForm')[0].reset();
                            })
                            .fail(function () {
                                $logMessage
                                    .css('color', '#f00')
                                    .css('background-color', '#000')
                                    .text('could not connect to restify');
                            });
                    });
                });
            }
        });
    }
};

module.exports = createQuestion;