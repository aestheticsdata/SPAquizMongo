'use strict';
var restify     = require('restify');
var mongoAccess = require('./mongoAccess');

var restServer = restify.createServer();

restServer
    .use(restify.bodyParser())
    .use(restify.fullResponse())
    .use(restify.authorizationParser());

restServer.get( '/questions', getQuestions);
restServer.post('/questions', addQuestion);
restServer.post('/questionsDelete', deleteQuestion);
restServer.post('/questionsUpdate', updateQuestion);

restServer.listen(8765);

function getQuestions(req, res, next) {

//    mongoAccess.dbCollection.find().toArray(function (err, questionsJson) {
//        res.header("Access-Control-Allow-Origin", "*");
//        res.send(questionsJson);
//    });
    mongoAccess.getQuestion("telemacus", "040675", req, res);
}

function addQuestion(req, res, next) {
    req.params.correctAnswer = parseInt(req.params.correctAnswer, 10);
    var newEntry = req.params;
    mongoAccess.insertNewItem(newEntry, res);
}

function deleteQuestion(req, res, next) {
//    console.log(req.params);
    mongoAccess.deleteQuestions(req.params, res);
//    res.send(200);
}

function updateQuestion(req, res, next) {
    mongoAccess.updateQuestion(req.params, res);
}
