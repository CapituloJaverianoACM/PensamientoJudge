var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verifyRouter');
var shell = require('shelljs');
var multer  = require('multer');
var path = require('path');

var CodeProblemUser = require('../models/codeProblemUser');
var Problem = require('../models/problems');
var Logs = require('../models/logs');
var fs = require('fs');

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

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Problem.find({}, function (err, problem){
    if (err) {
      console.log(err);
      Logs.create({log: err}, function(err, log){
        return false;
      });
    };
    console.log('Get Request'); // TODO - delete debug log
    res.json(problem);
  });
})

.post(Verify.verifyAdminUser, function(req, res, next) {
  Problem.create(req.body, function (err, problem) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return res.status(200).json({
        success : false,
        status: 'Problem already exists'
      });
    };
    var id = problem._id;
    problem.description = problem.description || {};
    problem.description.route_test_input = pathTestInput+problem._id+'/';
    problem.description.route_test_output = pathTestOutput+problem._id+'/';
    Problem.findOneAndUpdate({'_id' : problem._id }, {
        $set: problem
      }, {
        new: true
      }, function(err, problem) {
        if (err) {
          Logs.create({log: err}, function(err, log){
            return false;
          });
        };
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
  });
})

.delete(Verify.verifyAdminUser,function(req, res, next) {
  Problem.remove({}, function(err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(resp);
  });
});

problemRouter.route('/:problemName')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Problem.findOne({'name' : req.params.problemName}, function(err, problem) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(problem);
  });
})

.put(Verify.verifyAdminUser, function(req, res, next) {
  Problem.findOneAndUpdate({'_id' : req.body._id}, { /// TODO - johan
    $set: req.body
  }, {
    new: true
  }, function(err, problem) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    var delInExamplesFiles = shell.exec('rm '+problem.description.route_test_input+'*.insample');
    var delOutExamplesFiles = shell.exec('rm '+problem.description.route_test_output+'*.outsample');
    var len = problem.description.samples.length;
    for (var i = 0; i < len; i++) {
      samplesFileIn = 'printf "%s" "'+problem.description.samples[ i ][ 0 ]+'" > '+problem.description.route_test_input+i+'.insample';
      samplesFileOut = 'printf "%s" "'+problem.description.samples[ i ][ 1 ]+'" > '+problem.description.route_test_output+i+'.outsample';
      shell.exec(samplesFileIn);
      shell.exec(samplesFileOut);
    }
    res.json(problem);
  });
})

.delete(Verify.verifyAdminUser,function(req, res, next) {
  Problem.findOneAndRemove({'name' : req.params.problemName}, function (err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
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
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Problem.find({'corte' : req.params.corte}, function(err, problem) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(problem);
  });
});

problemRouter.route('/testCases/input/:_id/:itemName')
.get(Verify.verifyAdminUser, function(req,res){
    var filePath = path.join(pathTestInput+'/'+req.params._id, req.params.itemName);
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

.delete(Verify.verifyAdminUser, function(req,res){
  var path = pathTestInput+req.params._id+'/'+req.params.itemName;
    fs.unlink(  path , function(err) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
    });
});

problemRouter.route('/testCases/input/:_id')
.get(Verify.verifyAdminUser, function(req,res){
  fs.readdir(pathTestInput+req.params._id, function(err, files)  {
    res.json(files);
  });
})
.post(Verify.verifyAdminUser, function(req,res){
  uploadInput( req , res , function(err){
    if(err) {
      Logs.create({log: err},function(err, log) {
         res.json({error_code:1,err_desc:err});
       });
       return;
    }
  res.json({error_code:0,err_desc:null});
  });
});

problemRouter.route('/testCases/output/:_id/:itemName')
.get(Verify.verifyAdminUser, function(req,res){
    var filePath = path.join(pathTestOutput+'/'+req.params._id, req.params.itemName);
    var stat = fs.statSync(filePath);
    res.writeHead(200, { 'Content-Length': stat.size });
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})

.delete(Verify.verifyAdminUser, function(req,res){
  var path = pathTestOutput+req.params._id+'/'+req.params.itemName;
    fs.unlink(  path , function(err) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
    });
});

problemRouter.route('/testCases/output/:_id')
.get( Verify.verifyAdminUser, function(req,res){
  fs.readdir(pathTestOutput+req.params._id, function(err, files)  {
    res.json(files);
  });
})
.post(Verify.verifyAdminUser, function(req,res){
  uploadOutput( req , res , function(err){
    if(err) {
      Logs.create({log: err},function(err, log) {
         res.json({error_code:1,err_desc:err});
       });
       return;
    }
    res.json({error_code:0,err_desc:null});
  });
});

problemRouter.route('/getCode/:idProblem')
.get(Verify.verifyOrdinaryUser , function(req,res){
  var user = req.decoded._doc;
    CodeProblemUser.findOne({"userId":user._id,"problemId":req.params.idProblem},
    function(err,code){
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      if( !code ) code = {code:""};
      res.json({ code : code.code });
    }
  );
})
.post( Verify.verifyOrdinaryUser ,function( req , res ){
  var user = req.decoded._doc;
  var newCode = req.body;
  req.body.problemId = req.params.idProblem;
  req.body.userId = user._id;
  CodeProblemUser.remove({"userId":user._id,"problemId":req.params.idProblem},
    function(err,resp) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      CodeProblemUser.create(newCode,
        function( err , codeProblemUser ) {
          if (err) {
            Logs.create({log: err}, function(err, log){});
            return false;
          };
          res.status(200).json({
            success: true,
            status : 'Added OK'
          });
        }
      );
    }
  );
});

module.exports = problemRouter;
