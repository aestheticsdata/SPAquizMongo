define(function(require) {
    var 
        Handlebars = require('handlebars');
        signals    = require('jssignals'),
        templateVo = require('classes/services/vo/templateVO');
        
    return {
        loaded: new signals.Signal(),
        
        getTemplate: function () {
            self = this;
            $.get('templates/questions.tpl.html', function (loadedTpl) {

                templateVo.tpl     = loadedTpl;
                templateVo.tplFunc = Handlebars.compile(templateVo.tpl);

                self.loaded.dispatch();
            });
        }
    }            
});