define(['jquery'], function ($) {

    "use strict";

    return {
        $login: $('#login'),
        init: function (main) {
            var self = this;
            $('#welcomeName').text(self.getCookies('name'));

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
        },
        signinHandler: function (main) {
            var userName = $('#userName').val();
            var password = $('#password').val();
            if (localStorage.userName === userName && localStorage.password === password) {
                this.$login.hide();
                main.init();
            } else {
                $('#wrongLogin').text('wrong name/password');
            }
        },
        getCookies: function (value) {
            var list = document.cookie.split("; ");
            var theName = 'unknow';
            for (var i=0; i< list.length; i++) {
                var cookie = list[i];
                if (!cookie.indexOf(value)) {
                    var index = cookie.indexOf('=');
                    theName = cookie.substring(index+1);
                }
            }
            return theName;
        }
    }
});