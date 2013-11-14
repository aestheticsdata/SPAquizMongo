;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//var appState        = require('classes/appState');
var createQuestion  = require('./classes/createQuestion.js');
var deleteQuestions = require('./classes/deleteQuestions.js');

$(function () {
    createQuestion.init();
    deleteQuestions.init();

    $('#createBtn').trigger('click'); // display create view on page load
});
},{"./classes/createQuestion.js":3,"./classes/deleteQuestions.js":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
},{"./appState.js":2}],4:[function(require,module,exports){
'use strict';

var appState     = require('./appState.js');
var editQuestion = require('./editQuestion.js');

var deleteQuestions = {
    init: function () {
        $('#deleteBtn').on('click', function () {
            var $deleteBtn = $(this);

            if(!appState.isDelete) {
                $('#createBtn').removeClass('selectedBtn');
                $('#editBtn').removeClass('selectedBtn');
                $(this).addClass('selectedBtn');

                appState.isCreate = false;
                appState.isEdit   = false;
                appState.isDelete = true;

                $('#editMode').hide();

                $.get('./views/delete.html', function (data) {
                    $('#view')
                        .empty()
                        .append(data);
                    // TODO: sortir cette function
                    $.getJSON('http://127.0.0.1:8765/questions', function (data) {
                        var $questionsContainer = $('#questionsContainer');

                        $.each(data, function (key, entry) {
                            // TODO : sortir le html
                            var question = '<li><input type="checkbox" id="'+entry._id+'" name="'+entry._id+'"><label class="checkbox inline" for="'+key+'">'+entry.question+'</label></li>';
                            $questionsContainer.append(question);
                            $('#'+entry._id)
                                .next()
                                .on('mouseenter', function (e) {
                                    $(this)
                                        .removeClass('rollOut')
                                        .addClass('rollOver');
                                })
                                .on('mouseleave', function (e) {
                                    $(this)
                                        .removeClass('rollOver')
                                        .addClass('rollOut');
                                })
                                .on('click', function (e) {
                                    editQuestion(entry);
                                });
                        });
                        $('#deleteForm').submit(function (e) {
                            e.preventDefault();
                            var serializedForm = $(this).serialize();
                            if ($('input[type=checkbox]:checked').length !== 0) { // if no checkbox are checked disable submit button
                                $.post('http://127.0.0.1:8765/questionsDelete', serializedForm)
                                    .done(function () {
                                        appState.isDelete = false;
                                        $deleteBtn.trigger('click');
                                    })
                                    .fail(function () {
                                        $('#errMessage').css('color', '#f00');
                                        $('#errMessage').text('delete error');
                                    });
                            }
                        });
                    });
                });
            }
        });
    }
};

module.exports = deleteQuestions;
},{"./appState.js":2,"./editQuestion.js":5}],5:[function(require,module,exports){
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

},{"./appState.js":2}]},{},[1])
;