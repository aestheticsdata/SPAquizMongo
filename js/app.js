require.config({
    paths:{
        'classes'   : 'classes',
        'jquery'    : 'libs/jquery',
        'lodash'    : 'libs/lodash',
        'handlebars': 'libs/handlebars',
        'jssignals' : 'libs/signals.min'
    },
    shim: {
        'lodash': {
            exports: '_'
        }
    }
});

require(['jquery', 'classes/main', 'classes/login', 'classes/startupSequence'],
function ($,        Main,           Login,           StartSeq) {

    "use strict";

    $(function () {

        localStorage.userName = 'joe';
        localStorage.password = '123';

        function onStartupCompleted() {
            Login.init(Main);
        }

        StartSeq.startupCompleted.add(onStartupCompleted);
        StartSeq.start();
    });
});
