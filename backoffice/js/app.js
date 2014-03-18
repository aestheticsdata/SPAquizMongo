'use strict';

var login           = require('./classes/Login.js');
var afterLogin      = require('./classes/AfterLogin.js');

$(function () {
    login.init(afterLogin);
});

