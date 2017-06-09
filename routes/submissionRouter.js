var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var shell = require('shelljs');
var Verify = require('./verifyRouter');
var Submission = require('../models/submission');
var CounterSubmission = require('../models/counterSubmission');
var Problem = require('../models/problems');
var ObjectId = require('mongoose').Types.ObjectId;
var Logs = require('../models/logs');
var fs = require('fs');


var pathSource = './submissions-src/';
var pathExe = './submissions-exe/';


router.post('/init',Verify.verifyAdminUser,function(req,res,next){
  CounterSubmission.findOneAndUpdate({_id:"submissionid"},{$set:{sequence_value:0}},function (err,counterSubmission) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.writeHead(200,{
      'Content-Type': 'text/plain'
    });
    res.end('OK');
  });
});

function getNextSequenceValue(sequenceName) {
  return function(req,res,next){
    if( req.decoded._doc._id != req.body.userId ){
      var err ;
      err.json({
        message : "The id is diferent"
      });
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
    }
   CounterSubmission.findOneAndUpdate(
    {"_id": "submissionid" },
    {$inc:{"sequence_value":1}},
      function(err,doc) {
        if (err) {
          Logs.create({log: err}, function(err, log){});
          return false;
        };
        if(doc){ req.body._id =  doc.sequence_value; }
        next();
      });
  };
}

function getProblem() {
  return function( req, res , next ){
    Problem.findOne({'_id' : new ObjectId(req.body.problemId)}, function(err, problem) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      req.body.problem = problem;
      next();
    });
  };
}

function getProblemName() {
  return function( req, res , next ){

    Problem.findOne({'name' : req.params.problemName}, function(err, problem) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
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
    if( file.code === 0) {
      req.body.source_code = pathSourceComplete;
      var pathTestInput = submission.problem.description.route_test_input;
      var pathTestOutput = submission.problem.description.route_test_output;
      var input = shell.exec('if [ ! \"$(ls -A '+pathTestInput+')\" ];then exit 101; fi');
      var output = shell.exec('if [ ! \"$(ls -A '+pathTestOutput+')\" ];then exit 102; fi');
      if( input.code == 101 ) {
          console.log('The input folder is empty.');
      }
      else if( output.code == 102 ) {
        console.log('The output folder is empty.');
      }
      else if( time ) {
        var compiler = shell.exec('g++ -Wall -o '+pathExeComplete+' '+pathSourceComplete);
        if( !compiler.code ) {
            console.log('Compilation OK');
            var extIn = req.body.sample?'.insample':'.in';
            var extOut = req.body.sample?'.outsample':'.out';
            var TIMELIMITERROR = 124;
            var RUNTIMEERROR = 248;
            var WRONGANSWER = 64;
            var ACCEPTED = 0;
            var filesInput = fs.readdirSync(pathTestInput);
            var filesOutput = fs.readdirSync(pathTestOutput);
            var lenInput = filesInput.length;
            shell.exec('chmod +x ./judge/judge.sh');
            req.body.testsResults = [];
            req.body.genOut = [];
            req.body.totalCases = lenInput;
            var totAC = 0;
            req.body.veredict = 'Queue';
            for (var i = 0; i < lenInput; i++) {
              if( filesInput[ i ].split('.')[1] == 'insample'  || !req.body.sample ) {
                var param1 = pathTestInput+filesInput[i] + ' ';
                var param2 = pathTestOutput+filesOutput[i] + ' ';
                var param3 = pathTestInput+i + '.out ';
                var param4 = pathExeComplete + ' ';
                var param5 = time;
                var run = shell.exec("./judge/judge.sh "+param1+param2+param3+param4+param5);
                if( run.code == TIMELIMITERROR ) {
                  req.body.testsResults.push('Time limit');
                }
                else if( run.code == RUNTIMEERROR ) {
                  req.body.testsResults.push('Run Time Error');
                }
                else if( run.code == WRONGANSWER){
                  req.body.testsResults.push('Wrong Answer');
                }
                else if( run.code == ACCEPTED){
                  req.body.testsResults.push('Accepted');
                  ++totAC;
                }
                if(run.code == RUNTIMEERROR) {
                  var runTimeErr = " ";
                  var execError = run.stderr.split(" ");
                  for (var j = 4; j < execError.length; j++) {
                    if(execError[j] == "timeout") break;
                    runTimeErr = runTimeErr + execError[j] + " ";
                  }
                  req.body.genOut.push(runTimeErr);
                }
                else if(run.code != TIMELIMITERROR)
                  req.body.genOut.push(shell.exec('cat '+param3).stdout); // FIXME - Not show in console. Change Cat
                else
                  req.body.genOut.push('Terminated due to timeout. Check if you have a infinite loop.');
                shell.exec('rm '+param3); // FIXME - use file system not shell.
              }
            }
            req.body.veredict = 'Accepted';
            for( i = 0; i < req.body.testsResults.length; ++i){
              if(req.body.testsResults[i] != 'Accepted') {
                req.body.veredict = req.body.testsResults[i];
                break;
              }
            }
            req.body.totalAC = totAC;
            shell.exec('rm '+pathExeComplete);
        } else {
          var filesInput = fs.readdirSync(pathTestInput);
          var lenInput = filesInput.length;
          req.body.veredict = 'Compilation Error';
          req.body.testsResults = [];
          req.body.genOut = [];
          for(var i = 0; i < lenInput; ++i) {
            if( filesInput[ i ].split('.')[1] == 'insample'  || !req.body.sample ) {
              req.body.testsResults.push('Compilation Error');
              req.body.genOut.push(compiler.stderr);
            }
          }
          req.body.messageCompilation = compiler;
        }
      }
    }
    next();
  };
}

router.post('/submit' ,Verify.verifyOrdinaryUser,getNextSequenceValue('submissionid'), getProblem(), judge(), function(req,res,next) {
  if( !req.body.sample ) {
    Submission.create(req.body,function(err,submission){
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      res.json({
        success : true,
        submission: submission,
        data : req.body
      });
    });
  } else {
    res.json({
      success : true,
      submission: req.body
    });
  }
});


router.get('/', Verify.verifyOrdinaryUser, function(req,res,next) {
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
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(submissions);
  });
});

router.get('/user/:userName',Verify.verifyOrdinaryUser, function(req,res,next){
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
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(submissions);
  });

});
router.route('/idUser/:userId')
.delete(Verify.verifyAdminUser,function(req,res,next){
  Submission.remove({'userId':req.params.userId},function (err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(resp);
  });
});

router.route('/problem/:problemName')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
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
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(submissions);
  });

});
router.route('/idProblem/:problemId')
.delete(Verify.verifyAdminUser,function(req,res,next){
  Submission.remove({'problemId':req.params.problemId},function (err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(resp);
  });
});

router.route('/successRate/:problemId')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  var coutProbSubmissionQuery = {
    problemId: req.params.problemId,
  };

  var coutProbSubmissionAcceptedQuery = {
    problemId: req.params.problemId,
    veredict: "Accepted"
  };

  Submission.count(coutProbSubmissionQuery, function(err, allProbCount){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    Submission.count(coutProbSubmissionAcceptedQuery, function(err, acProbCount) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      var successRate = (acProbCount / allProbCount).toFixed(2);
      if(allProbCount == 0) successRate = 0;
      res.json({"successRate": successRate});
    });
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
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(submissions);
  });
});

router.get('/code/:id',Verify.verifyOrdinaryUser,function(req,res,next){
  Submission.find({"_id":req.params.id},
    function(err,submissions){
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      fs.readFile(submissions[0].source_code, 'utf8', function (err,data) {
        if (err) {
          Logs.create({log: err}, function(err, log){});
          return false;
        };
        res.json(data);
      });

    }
  );
});

module.exports = router;
