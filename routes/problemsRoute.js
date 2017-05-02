var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//var Problem = require('../models/problem');

var problemRouter = express.Router();
//problemRouter.use(bodyParser.json());

problemRouter.route('/')
.all(function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  next();
})
.get(function(req, res, next) {
    //res.sendFile('problem.html');
     res.render('index', { title: 'Express' });
});

module.exports = problemRouter;
