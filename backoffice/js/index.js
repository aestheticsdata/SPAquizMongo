// TODO : sortir les url en dur d'appel REST
// TODO : transform each create, edit, delete handler into a separate module
// TODO : mettre en memoire les vues pour ne pas les recharger à chaque fois
// TODO : use Backbone.View or AngularJS
'use strict';

$(function () {

   var isCreate = false,
       isEdit   = false,
       isDelete = false;


   $('#createBtn').on('click', function (e) {
       if(!isCreate) {
           $('#deleteBtn').removeClass('selectedBtn');
           $('#editBtn').removeClass('selectedBtn');
           $(this).addClass('selectedBtn');

           isCreate = true;
           isEdit   = false;
           isDelete = false;

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
                   $.post('http://www.hexfarm.com:8765/questions', serializedForm)
                   // $.post('http://127.0.0.1:8765/questions', serializedForm)
                   // $.post('http://127.0.0.1:8990/questions', serializedForm)
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

   $('#deleteBtn').on('click', function () {
        console.log('delete button');
        var $deleteBtn = $(this);

        if(!isDelete) {
            $('#createBtn').removeClass('selectedBtn');
            $('#editBtn').removeClass('selectedBtn');
            $(this).addClass('selectedBtn');

            isCreate = false;
            isEdit   = false;
            isDelete = true;

            $('#editMode').hide();

            $.get('./views/delete.html', function (data) {
                $('#view')
                    .empty()
                    .append(data);
                // TODO: sortir cette function
                $.getJSON('http://www.hexfarm.com:8765/questions', function (data) {
                // $.getJSON('http://127.0.0.1:8765/questions', function (data) {
                // $.getJSON('http://127.0.0.1:8990/questions', function (data) {
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
                            $.post('http://www.hexfarm.com:8765/questionsDelete', serializedForm)
                            // $.post('http://127.0.0.1:8765/questionsDelete', serializedForm)
                            // $.post('http://127.0.0.1:8990/questionsDelete', serializedForm)
                                .done(function () {
                                    isDelete = false;
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

   function editQuestion(entry) {
       if(!isEdit) {
           $('#deleteBtn').removeClass('selectedBtn');
           $('#createBtn').removeClass('selectedBtn');

           isCreate = false;
           isEdit   = true;
           isDelete = false;

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
                   $.post('http://www.hexfarm.com:8765/questionsUpdate', serializedForm)
                   // $.post('http://127.0.0.1:8765/questionsUpdate', serializedForm)
                   // $.post('http://127.0.0.1:8990/questionsUpdate', serializedForm)
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
   }

   $('#createBtn').trigger('click'); // display create view on page load
});