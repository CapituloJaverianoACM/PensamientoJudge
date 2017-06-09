var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verifyRouter');
var validator = require('validator');
var async = require("async");
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
var Logs = require('../models/logs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './profile-pictures/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ storage: storage}).single('file');



/* GET users listing. */
router.get('/', Verify.verifyAdminUser, function(req, res, next) {
  User.find({},function(err,users){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(users);
  });
});

router.post('/signup',function(req,res){
  User.register(new User(req.body),
    req.body.password, function(err,user)  {
      if(err) {
        Logs.create({log: err}, function(err, log){});
        return res.status(210).json({
          err:err,
          success: false
        });
      }
      passport.authenticate('local')(req,res,function(){
        return res.status(200).json({
          success: true,
          status:'Registration succesful!'
        });
      });
    });
});

function findByEmail(email) {
  var query = User.find({'email':email});
  query.exec(function(err,user){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    if(user) { return user;}
  });
}

function changeEmail() {
  return function(req,res,next) {
    User.findOne({ 'email' : req.body.username }, function(err, user) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      if (user) {
        req.body.username = user.username;
      }
      next();
    });
  };
}

router.route('/picture/:filePath')
.get(function(req, res, next) {
  res.sendFile(path.join(__dirname, '../profile-pictures/' + req.params.filePath));
});

router.route('/byEmail/:userEmail')

.get(function(req, res, next) {
  User.findOne({'email' : req.params.userEmail}, function(err, user) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    console.log(user);
    var userResponse = user;
    if(user) userResponse = {username: user.username}
    res.json(userResponse);
  });
})

.post(Verify.verifyOrdinaryUser, function(req, res) {
  if(req.decoded._doc.email != req.params.userEmail){
    Logs.create({log: "Not self user"}, function(err, log){});
    return false;
  }
  upload(req,res,function(err) {
    User.findOne({'email' : req.params.userEmail}, function(err, user) {
      if (err) {
        Logs.create({log: err}, function(err, log){});
        return false;
      };
      if(user.img) {
        fs.unlink(path.join(__dirname, '../'+ user.img));
      }
      User.update({'email' : req.params.userEmail}, {
          img: req.file.path
      }, function(err, affected, resp) {
        if (err) {
          Logs.create({log: err}, function(err, log){});
          return false;
        };
      });
      res.json({error_code:0,err_desc:null});
    });
  });
})

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
  if(req.decoded._doc.email != req.params.userEmail){
    Logs.create({log: "Not self user"}, function(err, log){});
    return false;
  }
  User.findOneAndUpdate({'email' : req.params.userEmail}, {
    $set: req.body
  }, {
    new: true
  }, function(err, user) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(user);
  });
})

.delete(Verify.verifyAdminUser,function(req, res, next) {
  User.findOneAndRemove({'email' : req.params.userEmail}, function (err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(resp);
  });
});

router.route('/role/:username')

.put(Verify.verifyAdminUser,function(req, res, next) {
  User.findOneAndUpdate({'username' : req.params.username},
  {
    is_admin : req.body.is_admin
  }, function( err , user ){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    res.json(user);
  });
});



router.post('/login',changeEmail(),function(req,res,next){
  passport.authenticate('local',function(err,user,info){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    if(!user){
      return res.status(201).json({
        success: false,
        err: info
      });
    }
    req.logIn(user,function(err){
      if(err){
        return res.status(500).jason({
          err: 'Could not log in user'
        });
      }
      var token = Verify.getToken(user);
      if(user.admin === true){
        res.status(200).json({
          status: 'Login succesful as Admin!',
          success: true,
          token: token,
          user: user
        });
      }
      else{
        res.status(200).json({
          status: 'Login succesful!',
          success: true,
          token: token,
          user: user
        });
      }
    });
  })(req,res,next);
});

router.get('/logout',function(req,res){
  req.logOut();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/profile',Verify.verifyOrdinaryUser,function(req,res,next){
  username = req.decoded._doc.username;
  User.findOne({'username':username},function(err,user){
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    if(user) {
      res.json({
        user:user
      });
    }
  });
});

router.route('/byUsername/:username')
.get(function(req, res, next) {
  User.findOne({'username' : req.params.username}, function (err, resp) {
    if (err) {
      Logs.create({log: err}, function(err, log){});
      return false;
    };
    var userResponse = {username: resp.username};
    res.json(userResponse);
  });
});

module.exports = router;
