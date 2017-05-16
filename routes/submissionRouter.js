var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var shell = require('shelljs');
var Verify = require('./verifyRouter');
var Submission = require('../models/submission');
var CounterSubmission = require('../models/counterSubmission');

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

function judge( ){
  return function( req , res , next ){
    var submission = req.body;
    var pathSourceComplete = pathSource + submission._id + '.cpp';
    var pathExeComplete = pathExe + submission._id;
    var file = shell.exec('echo ' + submission.source_code + ' > ' + pathSourceComplete );
    var time = 1;
    if( file.code == 0  )
    {
      var pathTestInput = './testCases/testInput/';
      var pathTestOutut = './testCases/testOutput/';
      var input = shell.exec('if [ ! \"$(ls -A '+pathTestInput+')\" ];then exit 101; fi');
      var output = shell.exec('if [ ! \"$(ls -A '+pathTestOutut+')\" ];then exit 102; fi');
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

router.post('/submit' ,getNextSequenceValue('submissionid'), judge( ) , function(req,res,next){
  // console.log(req.body);
  Submission.create(req.body,function(err,submission){
    if(err) return next( err);
    res.json({
      submission: submission
    });
  });
});

module.exports = router;
