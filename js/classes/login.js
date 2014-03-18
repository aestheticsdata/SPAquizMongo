define(function (require) {

    "use strict";

    var 
        $           = require('jquery'),
        Main        = require('classes/main'),
        QS          = require('classes/services/questionService'), 
        questionsVO = require('classes/services/vo/questionsVO'),
        TS          = require('classes/services/templateService'), 
        templateVO  = require('classes/services/vo/templateVO');

    return {
        $login: $('#login'),
        init: function (main) {
            var self = this;

            QS.loaded.addOnce(self.onJsonLoaded);
            TS.loaded.addOnce(self.onTemplateLoaded);

            $('#signin_button').on('click', function (e) {
                e.preventDefault();
                self.signinHandler(main);    
            });

            $('#login').on('keypress', function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    self.signinHandler(main);
                }
            });

            $('#password').on('keypress', function (e) {
                $('#wrongLogin').text('');
            })
        },
        signinHandler: function (main) {

            QS.getJson();
        },
        onJsonLoaded: function () {
            Main.initQuestions(questionsVo);
            TS.getTemplate();
        },
        onTemplateLoaded: function () {
            Main.tplFunc = templateVO.tplFunc;
            $('#login').hide();
            Main.init();
        }
    }
});