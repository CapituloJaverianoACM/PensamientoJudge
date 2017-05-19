var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verifyRouter');
var validator = require('validator');
var async = require("async");

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},function(err,users){
    if(err) throw err;
    res.json(users);
  });
});

router.post('/signup',function(req,res){
  // User.register(new User({ username : req.body.username }),
  User.register(new User(req.body),
    req.body.password, function(err,user)  {
      if(err)
      {
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

function findByEmail(email)
{
  var query = User.find({'email':email});
  query.exec(function(err,user){
    if(err)
    {
      return false;
    }
    if(user)
    {
      console.log(user);
      return user;
    }
  });
}

function changeEmail()
{
  return function(req,res,next)
  {
    User.findOne({ 'email' : req.body.username }, function(err, user) {
      if (err) { return next(err); }



      if (user) {
        req.body.username = user.username;
      }

      // Hand over control to passport
      next();
    });
  }
}

router.post('/login',changeEmail(),function(req,res,next){
  passport.authenticate('local',function(err,user,info){
    if(err){
      return next(err);
    }
    if(!user){
      // return res.status(401).json({
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
  // console.log(req.decoded._doc.username);
  username = req.decoded._doc.username;
  User.findOne({'username':username},function(err,user){
    if (err) { return next(err); }

    if(user) {
      res.json({
        user:user
      });
    }
  });
});

module.exports = router;
