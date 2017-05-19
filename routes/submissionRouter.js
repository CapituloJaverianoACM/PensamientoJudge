var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var shell = require('shelljs');
var Verify = require('./verifyRouter');
var Submission = require('../models/submission');
var CounterSubmission = require('../models/counterSubmission');
var Problem = require('../models/problems');
var ObjectId = require('mongoose').Types.ObjectId;

/// path submission source_code
var pathSource = './submissions-src/';
var pathExe = './submissions-exe/';


router.post('/init',function(req,res,next){
  CounterSubmission.findOneAndUpdate({_id:"submissionid"},{$set:{sequence_value:0}},function (err,counterSubmission) {
    console.log("hi");
      if(err) return next(err);
      res.writeHead(200,{
        'Content-Type': 'text/plain'
      });
      res.end('OK');
  });
});

function getNextSequenceValue(sequenceName){
  return function(req,res,next){
    if( req.decoded._doc._id != req.body.userId ){
      console.log("The id is diferent");
      var err ;
      err.json({
        message : "The id is diferent"
      });
      throw err;
    }
   CounterSubmission.findOneAndUpdate(
    {"_id": "submissionid" },
    {$inc:{"sequence_value":1}},
      // {"remove":true},
      // new : true,
      function(err,doc) {
        if(err)
          return next( err);
        // console.log("Submission is "+doc);
        if(doc){

          req.body._id =  doc.sequence_value;
        }
        next();
      }
    );
 }
}

function getProblem() {
  return function( req, res , next ){

    Problem.findOne({'_id' : new ObjectId(req.body.problemId)}, function(err, problem) {
      if(err) throw err;
      // console.log(problem+' jkljkl');
      req.body.problem = problem;
      next();
    });
  }
}
function getProblemName() {
  return function( req, res , next ){

    Problem.findOne({'name' : req.params.problemName}, function(err, problem) {
      if(err) throw err;
      // console.log(problem+' jkljkl');
      req.body.problem = problem;
      next();
    });
  }
}

function judge( ){
  return function( req , res , next ){
    var submission = req.body;
    var pathSourceComplete = pathSource + submission._id + '.cpp';
    var pathExeComplete = pathExe + submission._id;
    // console.log(submission.source_code);
    // var file = shell.exec('echo \"' + submission.source_code + '\" > ' + pathSourceComplete );
    // if you use printf the string is ok , if use echo the final file is wrong
    var file = shell.exec('printf "%s" \"' + submission.source_code + '\" > ' + pathSourceComplete );
    var time = submission.problem.time_limit;
    if( file.code == 0  && time )
    {
      // console.log(submission.problem);
      req.body.source_code = pathSourceComplete;
      var pathTestInput = submission.problem.description.route_test_input;
      var pathTestOutut = submission.problem.description.route_test_output;
      var input = shell.exec('if [ ! \"$(ls -A '+pathTestInput+')\" ];then exit 101; fi');
      var output = shell.exec('if [ ! \"$(ls -A '+pathTestOutut+')\" ];then exit 102; fi');
      // console.log(pathTestInput + ' ' + pathTestOutut + ' ' + time);
      if( input.code == 101 )
      {
          console.log('The input folder is empty.');
      }
      else if( output.code == 102 )
      {
        console.log('The output folder is empty.');
      }
      else
      {

        var compiler = shell.exec('g++ -Wall -o '+pathExeComplete+' '+pathSourceComplete);
        if( !compiler.code )
        {
            console.log('Compilation OK');
            var TIMELIMITERROR = 124;
            var RUNTIMEERROR = 248;
            var WRONGANSWER = 64;
            var command = 'for i in '+pathTestInput+'*.in; do '+
              'out=${i%.in}.out;'+
              // 'echo $out;'+
              'case=${i:'+pathTestInput.length+'};'+
              'case=${case%.in};'+
              // 'echo $case;'+
              'echo run case $case;'+
              'timeout '+time+'s '+pathExeComplete +' < $i > $out || { '+
              'code="$?" && '+
              // 'echo "$code" && '+
              'rm "$out" && '+
              'if [ \"$code\" == 124 ];then '+
              'exit 124;'+
              'else exit 248;'+
              'fi ; }; '+
              'diff $out '+pathTestOutut+'$case.out || { '+
              'rm "$out" && '+
              'exit 64;};'+
              'rm "$out";'+
              'done';
            var run = shell.exec(command);
            // console.log(command);
            // var run = shell.exec('timeout '+time+'s '+pathExeComplete );
            if( run.code == TIMELIMITERROR ){
              req.body.veredict = 'Time limit';
              console.log("Time limit");
            }
            else if( run.code == RUNTIMEERROR ) {
              console.log("Run time Error");
              req.body.veredict = 'Run Time Error';
            }
            else if( run.code == WRONGANSWER){
              console.log("Wrong Answer");
              req.body.veredict = 'Wrong Answer';
            }
            else {
              console.log('Accepted');
              req.body.veredict = 'Accepted';
            }
            // console.log(run);
            shell.exec('rm '+pathExeComplete);
        }
        else
        {
          console.log(compiler);
          req.body.veredict = 'Compilation Error';
        }
      }
    }
    next();
  }
}

router.post('/submit' ,Verify.verifyOrdinaryUser,getNextSequenceValue('submissionid'), getProblem(),judge( ) , function(req,res,next){
  // console.log(req.body);
  Submission.create(req.body,function(err,submission){
    if(err) return next( err);
    res.json({
      success : true,
      submission: submission
    });
  });
});


router.get('/',function(req,res,next) {
  // Submission.find({},function(err,submissions){
  //   if(err) throw err;
  //   res.json(submissions);
  // });
  Submission.aggregate([
    {
      $lookup:{
        from:"problems",
        localField:"problemId",
        foreignField:"_id",
        as:"problem"
      }
    },
    {
      $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"user"
      }
    }
  ],function(err,submissions){
    if(err) throw err;
    res.json(submissions);
  });
});

router.get('/user/:userName',function(req,res,next){
  Submission.aggregate([
    {
      $lookup:{
        from:"problems",
        localField:"problemId",
        foreignField:"_id",
        as:"problem"
      }
    },
    {
      $lookup:{
        from:"users",
        localField:"userId",
        foreignField:"_id",
        as:"user"
      }
    },
    {
      $match :{
        'user.username' : req.params.userName
      }
    }
  ],function(err,submissions){
    if(err) throw err;
    res.json(submissions);
  });

});

router.get('/:problemName',Verify.verifyOrdinaryUser,getProblemName(),function(req,res,next){
  Submission.find({"userId":req.decoded._doc._id },
    function(err,submissions){
      if(err)next(err);
      res.json(submissions);
    });
});
module.exports = router;
