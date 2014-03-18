'use strict';

//var MongoAccess = require('../../../js/nodeScripts/mongoAccess.js');

module.exports = {
    $login: $('#login'),
    init: function (afterLogin) {
        var self = this;

        $('#signin_button').on('click', function (e) {
            e.preventDefault();
            self.signinHandler(afterLogin);
        });

        $('#login').on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                self.signinHandler(afterLogin);
            }
        });
    },
    signinHandler: function (afterLogin) {
        var userName = $('#userName').val();
        var password = $('#password').val();
        if (localStorage.userName === userName && localStorage.password === password) {
            this.$login.hide();
            afterLogin.loginComplete();
        } else {
            $('#wrongLogin').text('wrong name/password');
        }
    }
};

