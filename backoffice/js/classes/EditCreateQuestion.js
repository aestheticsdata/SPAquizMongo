'use strict';

var appState  = require('./appState.js');
var VS        = require('./services/ViewService.js');
var KeepScope = require('./helpers/KeepScope.js');

var editCreateQuestion = {
    keepScope: new KeepScope(),

    entry: false,

    vs: new VS(),

    urls: {},

    minInputTextNumber: 2,

    setUrls: function (urls) {
        this.urls = urls;
    },

    init: function (entry) {
        var self = this;

        if (entry) {
            this.entry = entry;
            this.setup(entry);
        } else {
            // see comment in deleteQuestion.js just before $('#deleteBtn').on('click', function (event) {...});
            $('#createBtn').on('click', this.keepScope.save(this.setup, this));
        }
    },

    setup: function (e) {
        var self = this;

        function onViewLoaded() {
            console.log('onViewLoaded');
            $('#view')
                .empty()
                .append(self.vs.getVO());

            var $addButton       = $('#addButton'),
                $removeButton    = $('#removeButton'),
                $choiceContainer = $('#choiceContainer'),
                $choice          = $('.choice'),
                choiceLength     = $choice.length,
                $logMessage      = $('#logMessage');


            if (!self.entry) { // if entry is null we are in create mode
                $choiceContainer.append('' +
                    '<div class="singleChoiceContainer">' +
                    '<label class="control-label">choice 1: </label>' +
                    '<input type="text" name="choices" class="input-xxlarge choice"></input>' +
                    '<input type="radio" name="correctAnswer" class="radio" value="0" checked="true"></input>' +
                    '</div>'+
                    '<div class="singleChoiceContainer">' +
                    '<label class="control-label">choice 2: </label>' +
                    '<input type="text" name="choices" class="input-xxlarge choice"></input>' +
                    '<input type="radio" name="correctAnswer" class="radio" value="1"></input>' +
                    '</div>');
            } else { // edit mode
                $('#questionForm').prepend('<input type="hidden" id="hidden" name="_id"></script>');
                $('#question').val(self.entry.question);
                $('#hidden').val(self.entry._id);

                for (var i in self.entry.choices ) {
                    $choiceContainer.append('<div class="singleChoiceContainer"><label class="control-label">choice '+(parseInt(i,10)+1)+': </label><input type="text" name="choices" class="input-xxlarge choice" value="'+self.entry.choices[i]+'"></input><input type="radio" name="correctAnswer" class="radio" value="'+i+'" ></input></div>');
                    if (self.entry.correctAnswer == parseInt(i, 10)) {
                        $choiceContainer.find('input[type=radio]').prop('checked', true);
                    }
                }
            }

            $addButton.on('click', function (e) {
                choiceLength = $('.choice').length;
                var choiceInputField = '<div class="singleChoiceContainer"><label>choice '+(choiceLength+1)+': </label><input type="text" name="choices" class="input-xxlarge choice" ></input><input type="radio" class="radio" value="'+choiceLength+'" name="correctAnswer"></input></div>';

                e.preventDefault();

                $choiceContainer.append(choiceInputField);
            });

            $removeButton.on('click', function (e) {
                var $singleChoiceContainer = $('.singleChoiceContainer');
                e.preventDefault();
                if ($singleChoiceContainer.length > self.minInputTextNumber) {
                    $singleChoiceContainer.last().remove();
                }
            });

            $('#questionForm').submit(function (e) {
                var serializedForm = $(this).serialize();
                var url            = self.entry ? self.urls.editRESTURL : self.urls.createRESTURL;

                e.preventDefault();

                $.post(url, serializedForm)
                    .done(function () {
                        $logMessage
                            .text('question processed')
                            .delay(800)
                            .fadeOut(200);
                        if (appState.isCreate) {
                            $('#questionForm')[0].reset();
                        } else {
                            $('#deleteBtn').trigger('click');
                        }
                    })
                    .fail(function () {
                        $logMessage
                            .css('color', '#f00')
                            .css('background-color', '#000')
                            .text('could not connect to restify');
                    });
            });
        }

        if(!appState.isCreate || appState.isEdit) {
            $('#deleteBtn').removeClass('selectedBtn');

            appState.isCreate = e ? false : true;
            appState.isEdit   = e ? true  : false;
            appState.isDelete = false;

            if (appState.isCreate) {
                $('#createBtn').addClass('selectedBtn');
                self.entry = false; // coming from edit mode we must reset entry
            }

            if (e) { // edit mode
                $('#editMode').show();
            } else { // create mode
                $('#editMode').hide();
            }

            if (self.vs.getVO() === undefined) {
                self.vs.loaded.addOnce(onViewLoaded);
                self.vs.getView('./views/create.html');
            } else { // already loaded
                onViewLoaded();
            }
        }
    }
 };

module.exports = editCreateQuestion;