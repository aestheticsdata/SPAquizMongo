'use strict';

var appState     = require('./appState.js');
var editQuestion = require('./EditCreateQuestion.js');
var VS           = require('./services/ViewService.js');
var QS           = require('./services/QuestionsJSONService.js');
var JsonVo       = require('./services/vo/JsonVO.js');
var KeepScope    = require('./helpers/KeepScope.js');


var deleteQuestions = {
    keepScope: new KeepScope(),

    urls: {},

    setUrls: function (urls) {
        this.urls = urls;
    },

    init: function () {
        var self = this;

        /*
         in EditCreateQuestion.js the keepScope.save is shorter.
         Here we need to keep track of the deleteBtn jquery object.
         But it's tricky because in EditCreateQuestion.js,
         the setup  method is called with a parameter "e" which is not an event but a question object when editing mode.
         This complicated syntax is just here to be able to define once $deleteBtn, but $deleteBtn is used only 2 times.
         So if we want, we can get rid of this complicated syntax, and duplicate the jquery call: $('#deleteBtn')
        */
        $('#deleteBtn').on('click', function (event) {
            self.keepScope.save(self.setup, self, event)();
        });
    },

    vs: {},

    setup: function (event) {
        var self = this,
            $deleteBtn = $(event.currentTarget);

        this.vs = new VS();

        function loadQuestionsJSON() {
            QS.loaded.addOnce(onViewLoaded);
            QS.getJSON(self.urls.jsonUrl);
        }

        function onViewLoaded () {
            var $questionsContainer = {};
            $('#view')
                .empty()
                .append(self.vs.getVO());

            $questionsContainer = $('#questionsContainer');

            $.each(JsonVo.content, function (key, entry) {
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
                        editQuestion.init(entry);
                    });
            });
            $('#deleteForm').submit(function (e) {
                e.preventDefault();
                var serializedForm = $(this).serialize();
                if ($('input[type=checkbox]:checked').length !== 0) { // if no checkbox are checked disable submit button
                    $.post(self.urls.deleteRESTUrl, serializedForm)
                        .done(function () {
                            appState.isDelete = false; // needed to reload the page
                            self.vs = null;
                            $deleteBtn.trigger('click'); // reload the page
                        })
                        .fail(function () {
                            $('#errMessage')
                                .css('color', '#f00')
                                .text('delete error');
                        });
                }
            });
        }

        if(!appState.isDelete) {
            $('#createBtn').removeClass('selectedBtn');
            $deleteBtn.addClass('selectedBtn');

            appState.isCreate = false;
            appState.isEdit   = false;
            appState.isDelete = true;

            $('#editMode').hide();

            if (self.vs.getVO() === undefined) {
                self.vs.loaded.addOnce(loadQuestionsJSON);
                self.vs.getView('./views/delete.html');
            } else {
                onViewLoaded();
            }
        }


    }
};

module.exports = deleteQuestions;