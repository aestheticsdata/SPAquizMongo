/*
    a post is :
        { "question": "what is ?",
          "choices": ["jn", "lm", "po"],
          "correctAnswer": 2
         }
*/
"use strict";

$(function () {
   var $addButton       = $('#addButton'),
       $removeButton    = $('#removeButton'),
       $choiceContainer = $('#choiceContainer'),
       $choice          = $('.choice'),
       $choiceLength    = $choice.length;

   $addButton.on('click', function (e) {
       $choiceLength = $('.choice').length;
       var choiceInputField = '<div class="singleChoiceContainer"><label>choice '+($choiceLength+1)+': </label><input type="text" name="choice" class="input-xxlarge choice" ></input><input type="radio" class="radio" value="'+$choiceLength+'" name="correctAnswer"></input></div>';

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
       console.log('submit form');
   });
});