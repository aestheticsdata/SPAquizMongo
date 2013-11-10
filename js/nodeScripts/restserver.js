'use strict';
var restify     = require('restify');
var mongoAccess = require('./mongoAccess');

var restServer = restify.createServer();

restServer
    .use(restify.bodyParser())
    .use(restify.fullResponse());

restServer.get( '/questions', getQuestions);
restServer.post('/questions', addQuestion);

restServer.listen(8765);

function getQuestions(req, res, next) {

    mongoAccess.dbCollection.find().toArray(function (err, questionsJson) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(questionsJson);
    });
}

function addQuestion(req, res, next) {
    req.params.correctAnswer = parseInt(req.params.correctAnswer);
    var newEntry = req.params;
    mongoAccess.insertNewItem(newEntry, res);
}
