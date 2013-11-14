'use strict';

var appState = require('./appState.js');

module.exports = function (entry) {
        if(!appState.isEdit) {
            $('#deleteBtn').removeClass('selectedBtn');
            $('#createBtn').removeClass('selectedBtn');

            appState.isCreate = false;
            appState.isEdit   = true;
            appState.isDelete = false;

            $('#editMode').show();

            $.get('./views/edit.html', function (data) {
                $('#view')
                    .empty()
                    .append(data);


                $('#question').val(entry.question);
                $('#hidden').val(entry._id);

                var $addButton       = $('#addButton'),
                    $removeButton    = $('#removeButton'),
                    $choiceContainer = $('#choiceContainer'),
                    $choice          = $('.choice'),
                    choiceLength     = $choice.length,
                    $logMessage      = $('#logMessage');

                for (var i in entry.choices ) {
                    if (entry.correctAnswer == i) {  // == to cast to int, TODO: use parseInt
                        $choiceContainer.append('<div class="singleChoiceContainer"><label class="control-label">choice '+i+': </label><input type="text" name="choices" class="input-xxlarge choice" value="'+entry.choices[i]+'"></input><input type="radio" name="correctAnswer" class="radio" value="'+i+'" checked="checked"></input></div>');
                    } else {
                        $choiceContainer.append('<div class="singleChoiceContainer"><label class="control-label">choice '+i+': </label><input type="text" name="choices" class="input-xxlarge choice" value="'+entry.choices[i]+'"></input><input type="radio" name="correctAnswer" class="radio" value="'+i+'" ></input></div>');
                    }
                }

                // TODO factorise le code suivant dans une fonction, code est utilisé dans la page create :
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

                $('#editForm').submit(function (e) {
                    e.preventDefault();
                    var serializedForm = $(this).serialize();
                    $.post('http://127.0.0.1:8765/questionsUpdate', serializedForm)
                        .done(function () {
                            $logMessage
                                .text('question updated')
                                .delay(800)
                                .fadeOut(200);
                            $('#editForm')[0].reset();
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
    };
