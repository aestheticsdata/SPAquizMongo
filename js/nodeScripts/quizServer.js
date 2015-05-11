'use strict';

var express = require('express');
var mongoAccess = require('./mongoAccess');

var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('secret key'));
app.use(express.session());

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		console.log('redirect to login');
		console.log(req.session);
		
		req.session.error = 'access denied';
		res.redirect('/login');
	}
}

// enable CORS - especially when AngularJS $http.post doing a pre-flight OPTIONS request before POST
app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});

app.post('/login', function (req, res) {
	
	var username = req.body.username,
		password = req.body.password;

	if (username === 'user' && password === 'pass') {
		req.session.regenerate(function () {
			req.session.user = username;
			// res.redirect('questions');
			mongoAccess.dbCollection.find().toArray(function (err, questionsJson) {
        		res.header("Access-Control-Allow-Origin", "*");
        		res.send(questionsJson);
    		});
		});
	} else {
		// res.redirect('/login');
		req.session.error = 'access denied';
		res.send(401);
	}
});

// app.get('/questions', restrict, function (req, res) {
app.get('/questions', function (req, res) {
    mongoAccess.dbCollection.find().toArray(function (err, questionsJson) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(questionsJson);
    });
});


app.listen(8990);