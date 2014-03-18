'use strict';
var mongodb  = require('mongodb'),
    config   = require('./config'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
//    mongoclient = new MongoClient(new Server(config.param.localUrl , 27017, {native_parser:true})),
    db;



//mongoclient.open(function (err, mongoclient) {
//    db = mongoclient.db('quiz');
//    exports.dbCollection = db.collection('questions');
//});

exports.getQuestion = function (user, pwd, req, res) {
//    db.authenticate(config.param.user1.name, config.param.user1.pwd, function (err, res) {
//    });
//    MongoClient.connect('mongodb://'+user+':'+pwd+'@'+config.param.localUrl+'/'+'quiz', function (err, db) {
    MongoClient.connect('mongodb://'+config.param.localUrl+'/'+'quiz', function (err, db) {
        db.collection('questions').find().toArray(function (err, questionsJson) {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(questionsJson);
        });
    });
};

exports.insertNewItem = function (newEntry, res) {
    db.collection('questions').insert(newEntry, function () {
        res.send(201);
    });
};

exports.deleteQuestions = function (questionsToBeDeleted, res) {
    for(var _id in questionsToBeDeleted) {
        db.collection('questions').remove({"_id": ObjectID(""+_id)}, function () {});
    }
    res.send(200);
};

exports.updateQuestion = function (updatedEntry, res) {
    db.collection('questions').update({_id: ObjectID(""+updatedEntry._id)}, {$set:{question:updatedEntry.question, choices:updatedEntry.choices, correctAnswer:updatedEntry.correctAnswer}}, function (err, nb) {
        if (!err) {
            res.send(200);
        }
    });
};


