var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verifyRouter');
var shell = require('shelljs');
var multer  = require('multer');

var Problem = require('../models/problems');

var problemRouter = express.Router();
problemRouter.use(bodyParser.json());

var pathTestInput = './testCases/testInput/';
var pathTestOutput = './testCases/testOutput/';


var storageInput = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, pathTestInput+req.params._id);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var uploadInput = multer({ //multer settings
                storage: storageInput
            }).single('file');

var storageOutput = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, pathTestOutput+req.params._id);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
    }
});

var uploadOutput = multer({ //multer settings
                storage: storageOutput
            }).single('file');



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
    // res.writeHead(200, { // 200 OK, added problem without errors.
    //   'Content-Type':'application/json'
    // });
    // res.end('Added the problem with id: ' + id);
    problem.description = problem.description || {};
    problem.description.route_test_input = pathTestInput+problem._id;
    problem.description.route_test_output = pathTestOutput+problem._id;
    // console.log(problem);
    // console.log('fdsaf');
    Problem.findOneAndUpdate({'_id' : problem._id }, {
        $set: problem
      }, {
        new: true
      }, function(err, problem) {
        if(err) throw err;
        // console.log(problem);
        var dirTestInputAdd = shell.exec('mkdir '+problem.description.route_test_input);
        var dirTestOutputAdd = shell.exec('mkdir '+problem.description.route_test_output);
        if( !dirTestInputAdd )
          console.log(dirTestInputAdd);
        if( !dirTestOutputAdd )
          console.log(dirTestOutputAdd);
        return res.status(200).json({
          success : true,
          status: 'Added the problem with id: ' + id
        });
      });
      //--------------
  });
})

.delete(Verify.verifyAdminUser,function(req, res, next) {
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
  // Problem.findOneAndUpdate({'name' : req.params.problemName}, {
  Problem.findOneAndUpdate({'_id' : req.body._id}, { /// TODO - johan
    $set: req.body
  }, {
    new: true
  }, function(err, problem) {
    if(err) throw err;
    res.json(problem);
  });
})

.delete(Verify.verifyAdminUser,function(req, res, next) {
  // TODO - Quety to delete.
  Problem.findOneAndRemove({'name' : req.params.problemName}, function (err, resp) {
    if (err) throw err;
    // console.log(resp);
    ///hioola
    var dirTestInputDel = shell.exec('rm -rf '+resp.description.route_test_input);
    var dirTestOutputDel = shell.exec('rm -rf '+resp.description.route_test_output);
    if( !dirTestInputDel )
      console.log(dirTestInputDel);
    if( !dirTestOutputDel )
      console.log(dirTestOutputDel);
    res.json(resp);
  });
});

problemRouter.route('/corte/:corte')
.get(function(req, res, next) {
  Problem.find({'corte' : req.params.corte}, function(err, problem) {
    if(err) throw err;
    res.json(problem);
  });
});

problemRouter.route('/testCases/input/:_id')
.delete(function(req,res){
  Problem.findOne({"_id":req.params._id},function(err,problem){
    if(err) throw err;
    var len = problem.description.testCases.length;
    for( var i = 0 ; i < len ; ++i )
    {
    }
    res.json({error_code:0,err_desc:null});
  });
})
.post(function(req,res){
  uploadInput( req , res , function(err){
    // console.log(req.file);
    if(err){
         res.json({error_code:1,err_desc:err});
         return;
    }
    Problem.findOne({"_id":req.params._id},function(err,problem){
      if(err) throw err;
      // console.log(problem);
      var len = problem.description.testCases.length;
      var nameOther = req.file.originalname.split('.')[0] + '.out';
      var pos = len;
      for( var i = 0 ; i < len ; ++i )
      {
          if( problem.description.testCases[ i ][ 0 ] == req.file.originalname )
          {
            pos == -1 ;
          }
          else if( problem.description.testCases[ i ][ 1 ] == nameOther )
          {
            pos= i;
            break;
          }
      }
      if( pos != -1  )
      {
        if( pos == len )
          problem.description.testCases.push(new Array<String>(2));
        problem.description.testCases[pos][0] = req.file.originalname;
        // console.log(problem.description);
        Problem.findOneAndUpdate({
          "_id":req.params._id
        },
        {
          $set : { "description":problem.description}
        },function(err,pro){
          if( err ) throw err;
          console.log("OK");
        });
      }
      res.json({error_code:0,err_desc:null});
    });
  });
});

problemRouter.route('/testCases/output/:_id')
.post(function(req,res){
  uploadOutput( req , res , function(err){
    // console.log(req.file);
    if(err){
         res.json({error_code:1,err_desc:err});
         return;
    }
    Problem.findOne({"_id":req.params._id},function(err,problem){
      if(err) throw err;
      // console.log(problem.description);
      var len = problem.description.testCases.length;
      var nameOther = req.file.originalname.split('.')[ 0 ] + '.in';
      var pos = len;
      for( var i = 0 ; i < len ; ++i )
      {
          if( problem.description.testCases[ i ][ 1 ] == req.file.originalname )
          {
            pos == -1 ;
          }
          else if( problem.description.testCases[ i ][ 0 ] == nameOther )
          {
            pos= i;
            break;
          }
      }
      if( pos != -1  )
      {
        if( pos == len )
          problem.description.testCases.push(new Array<String>(2));
        problem.description.testCases[pos][ 1 ] = req.file.originalname;
        // console.log(problem.description);
        Problem.findOneAndUpdate({
          "_id":req.params._id
        },
        {
          $set : { "description":problem.description}
        },function(err,pro){
          if( err ) throw err;
          console.log("OK");
        });
      }
      res.json({error_code:0,err_desc:null});
    });
  });
});


module.exports = problemRouter;
