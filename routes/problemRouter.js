var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Problem = require('../models/problems');

var problemRouter = express.Router();
problemRouter.use(bodyParser.json());

problemRouter.route('/')

.get(function(req, res, next) {
  Problem.find({}, function (err, problem){
    if (err) throw err;
    console.log('Get Request'); // TODO - delete debug log
    res.json(problem);
  });
})

.post(function(req, res, next) {
  Problem.create(req.body, function (err, problem) {
    console.log(req.body);
    if (err) throw err;
    console.log('Problem created!');
    var id = problem._id;
    res.writeHead(200, { // 200 OK, added problem without errors.
      'Content-Type': 'text/plain'
    });
    res.end('Added the problem with id: ' + id);
  });
})

.delete(function(req, res, next) {
  Problem.remove({}, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});

problemRouter.route('/:problemName')

.get(function(req, res, next) {
  Problem.findOne({'name' : req.params.problemName}, function(err, problem) {
    if(err) throw err;
    res.json(problem);
  });
})

.put(function(req, res, next) {
  Problem.findOneAndUpdate({'name' : req.params.problemName}, {
    $set: req.body
  }, {
    new: true
  }, function(err, problem) {
    if(err) throw err;
    res.json(problem);
  });
})

.delete(function(req, res, next) {
  // TODO - Quety to delete.
  Problem.findOneAndRemove({'name' : req.params.problemName}, function (err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});

module.exports = problemRouter;
