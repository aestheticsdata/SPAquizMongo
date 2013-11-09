var mongoose = require('mongoose');
var config   = require('./config');

var db = mongoose.connection;

var questionsSchema = mongoose.Schema({
    question:String,
    choices:Array,
    correctAnswer:Number
});

var QuestionsModel = mongoose.model('Questions', questionsSchema); // the third parameter could be a collection name

db.on('error', function () {
    console.log('connection error');
});

mongoose.connect(config.param.mongoose_local);

exports.qm = QuestionsModel;


