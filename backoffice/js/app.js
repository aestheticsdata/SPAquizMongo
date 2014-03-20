'use strict';

var login           = require('./classes/Login.js');
var afterLogin      = require('./classes/AfterLogin.js');

$(function () {
	localStorage.userName = 'user';
    localStorage.password = 'pass';

    login.init(afterLogin);
});

