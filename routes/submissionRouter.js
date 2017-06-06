var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var shell = require('shelljs');
var Verify = require('./verifyRouter');
var Submission = require('../models/submission');
var CounterSubmission = require('../models/counterSubmission');
var Problem = require('../models/problems');
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');


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
      function(err,doc) {
        if(err)
          return next( err);
        if(doc){

          req.body._id =  doc.sequence_value;
        }
        next();
      }
    );
 };
}

function getProblem() {
  return function( req, res , next ){

    Problem.findOne({'_id' : new ObjectId(req.body.problemId)}, function(err, problem) {
      if(err) throw err;
      req.body.problem = problem;
      next();
    });
  };
}
function getProblemName() {
  return function( req, res , next ){

    Problem.findOne({'name' : req.params.problemName}, function(err, problem) {
      if(err) throw err;
      req.body.problem = problem;
      next();
    });
  };
}

function judge( ){
  return function( req , res , next ){
    var submission = req.body;
    var pathSourceComplete = pathSource + submission._id + '.cpp';
    var pathExeComplete = pathExe + submission._id;
    var file = shell.exec('printf "%s" \"' + submission.source_code + '\" > ' + pathSourceComplete );
    var time = submission.problem.time_limit;
    if( file.code === 0     )
    {
      req.body.source_code = pathSourceComplete;
      var pathTestInput = submission.problem.description.route_test_input;
      var pathTestOutput = submission.problem.description.route_test_output;
      var input = shell.exec('if [ ! \"$(ls -A '+pathTestInput+')\" ];then exit 101; fi');
      var output = shell.exec('if [ ! \"$(ls -A '+pathTestOutput+')\" ];then exit 102; fi');
      if( input.code == 101 )
      {
          console.log('The input folder is empty.');
      }
      else if( output.code == 102 )
      {
        console.log('The output folder is empty.');
      }
      else if( time )
      {

        var compiler = shell.exec('g++ -Wall -o '+pathExeComplete+' '+pathSourceComplete);
        if( !compiler.code )
        {
            console.log('Compilation OK');
            var extIn = req.body.sample?'.insample':'.in';
            var extOut = req.body.sample?'.outsample':'.out';
            var TIMELIMITERROR = 124;
            var RUNTIMEERROR = 248;
            var WRONGANSWER = 64;
            var ACCEPTED = 0;
            var filesInput = fs.readdirSync(pathTestInput);
            var filesOutput = fs.readdirSync(pathTestOutput);
            console.log(filesInput);
            console.log(filesOutput);
            var lenInput = filesInput.length;
            shell.exec('chmod +x ./judge/judge.sh');
            req.body.testsResults = [];
            req.body.genOut = [];
            req.body.totalCases = lenInput;
            var totAC = 0;
            for (var i = 0; i < lenInput; i++) {
              if( filesInput[ i ].split('.')[1] == 'insample'  || !req.body.sample )
              {
                var param1 = pathTestInput+filesInput[i] + ' ';
                var param2 = pathTestOutput+filesOutput[i] + ' ';
                var param3 = pathTestInput+i + '.out ';
                var param4 = pathExeComplete + ' ';
                var param5 = time;
                var run = shell.exec("./judge/judge.sh "+param1+param2+param3+param4+param5);
                if( run.code == TIMELIMITERROR ){
                  req.body.veredict = 'Time limit';
                  // if( !req.body.sample )
                  //   break;
                  console.log("Time limit");
                  req.body.testsResults.push('Time limit')
                }
                else if( run.code == RUNTIMEERROR ) {
                  console.log("Run time Error");
                  req.body.veredict = 'Run Time Error';
                  // if( !req.body.sample )
                  //   break;
                  req.body.testsResults.push('Run Time Error')
                }
                else if( run.code == WRONGANSWER){
                  console.log("Wrong Answer");
                  req.body.veredict = 'Wrong Answer';
                  // if( !req.body.sample )
                  //   break;
                  req.body.testsResults.push('Wrong Answer')
                }
                else if( run.code == ACCEPTED){
                  console.log('Accepted');
                  req.body.veredict = 'Accepted';
                  req.body.testsResults.push('Accepted')
                  ++totAC;
                }
                req.body.genOut.push(shell.exec('cat '+param3).stdout);
                shell.exec('rm '+param3);

              }
            }
            req.body.totalAC = totAC;
            shell.exec('rm '+pathExeComplete);
        }
        else
        {
          console.log(compiler);
          req.body.veredict = 'Compilation Error';
          req.body.messageCompilation = compiler;
        }
      }
    }
    next();
  };
}

router.post('/submit' ,Verify.verifyOrdinaryUser,getNextSequenceValue('submissionid'), getProblem(),judge( ) , function(req,res,next){
  if( !req.body.sample ) {
    Submission.create(req.body,function(err,submission){
      if(err) return next( err);
      res.json({
        success : true,
        submission: submission,
        data : req.body
      });
    });
  }else{
    res.json({
      success : true,
      submission: req.body
    });
  }
});


router.get('/',function(req,res,next) {
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
    },{
      $sort : { time_stamp : -1 }
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
    },{
      $sort : { time_stamp : -1 }
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
router.route('/idUser/:userId')
.delete(Verify.verifyAdminUser,function(req,res,next){
  Submission.remove({'userId':req.params.userId},function (err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});

router.route('/problem/:problemName')

.get(function(req,res,next){
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
    },{
      $sort : { time_stamp : -1 }
    },
    {
      $match :{
        'problem.name' : req.params.problemName
      }
    }
  ],function(err,submissions){
    if(err) throw err;
    res.json(submissions);
  });

});
router.route('/idProblem/:problemId')
.delete(Verify.verifyAdminUser,function(req,res,next){
  Submission.remove({'problemId':req.params.problemId},function (err, resp) {
    if (err) throw err;
    res.json(resp);
  });
});


router.get('/userProblem/:problemName',Verify.verifyOrdinaryUser,function(req,res,next){
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
    },{
      $sort : { time_stamp : -1 }
    },
    {
      $match :{
        'problem.name' : req.params.problemName,
        'user.username' : req.decoded._doc.username
      }
    }
  ],function(err,submissions){
    if(err) throw err;
    res.json(submissions);
  });
});
router.get('/code/:id',Verify.verifyOrdinaryUser,function(req,res,next){
  Submission.find({"_id":req.params.id},
    function(err,submissions){
      if(err) next(err);
      fs.readFile(submissions[0].source_code, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        res.json(data);
      });

    }
  );
});

module.exports = router;
