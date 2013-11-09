var restify     = require('restify');
var mongoAccess = require('./mongoAccess');

var restServer = restify.createServer();

restServer
    .use(restify.bodyParser())
    .use(restify.fullResponse());

restServer.get( '/questions', getQuestions);
restServer.post('/questions', addQuestions);

restServer.listen(8765);

function getQuestions(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    mongoAccess.qm.find(function(err, questions){
        if (err) {
            console.log('error');
        } else {
            res.send(questions);
        }
    });
}

function addQuestions(req, res, next) {
     console.log(req.params);
}