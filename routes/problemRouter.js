var express = require('express');
var bodyParser = require('body-parser');


var problemRouter = express.Router();
problemRouter.use(bodyParser.json());

problemRouter.route('/')
.all(function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  next();
})

.get(function(req, res, next) {
  res.end("Get all problems");
})

.post(function(req, res, next) {
  res.end("We will add " + req.body.name);
})

.delete(function(req, res, next) {
  res.end("Delete all problems")
});

problemRouter.route('/:problemName')
.all(function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  next();
})

.get(function(req, res, next) {
  res.end("Send problem with name " + req.params.problemName );
})

.put(function(req, res, next) {
  res.end("Update problem with name " + req.params.problemName);
})

.delete(function(req, res, next) {
  res.end("Delete problem with name " + req.params.problemName );
})

module.exports = problemRouter;
