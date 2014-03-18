define(function (require) {
    var 
        signals     = require('jssignals');
        questionsVo = require('classes/services/vo/questionsVO');


    return {
        loaded: new signals.Signal(),
        
        getJson: function () {
            self = this;
            
            $.ajax({
                type     : 'POST',
                url      : 'http://'+location.hostname+':8990/login',
                data     : {username:$('#userName').val(), password:$('#password').val()},
                success  : function (jsonQuestions) {
                    // console.log(jsonQuestions);
                    questionsVo.allQuestions    = jsonQuestions;
                    questionsVo.questionsLength = questionsVo.allQuestions.length;
                    self.loaded.dispatch();
                },
                error    : function () {
                    $('#wrongLogin').text('wrong usename/password');
                },
                dataType : 'json' 
            });
        }
    };
});