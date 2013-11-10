'use strict';
var mongodb  = require('mongodb');
var config   = require('./config');

var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var mongoclient = new MongoClient(new Server("127.0.0.1", 27017, {native_parser:true}));

var db;
mongoclient.open(function (err, monclient) {
    db = mongoclient.db('quiz');
    exports.dbCollection = db.collection('questions');
});

exports.insertNewItem = function (newEntry, res) {
    db.collection('questions').insert(newEntry, function () {
        res.send(201);
    });
};


