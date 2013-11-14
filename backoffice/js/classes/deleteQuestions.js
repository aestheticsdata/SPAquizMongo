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