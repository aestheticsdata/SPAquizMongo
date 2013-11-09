define(function (require) {
    var 
        signals     = require('jssignals');
        questionsVo = require('classes/services/vo/questionsVO');


    return {
        loaded: new signals.Signal(),
        
        getJson: function () {
            self = this;
            $.getJSON('http://'+location.hostname+':8765/questions', function (jsonQuestions) {

                questionsVo.allQuestions    = jsonQuestions;
                questionsVo.questionsLength = questionsVo.allQuestions.length;

                self.loaded.dispatch();               
            });
        }
    };
});