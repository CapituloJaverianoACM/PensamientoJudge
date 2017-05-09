var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verifyRouter');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res){
  // User.register(new User({ username : req.body.username }),
  User.register(new User(req.body),
    req.body.password, function(err,user)  {
      if(err)
      {
        return res.status(500).json({err:err});
      }
      passport.authenticate('local')(req,res,function(){
        return res.status(200).json({status:'Registration succesful!'});
      });
    });
});

router.post('/login',function(req,res,next){
  passport.authenticate('local',function(err,user,info){
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(401).json({
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
          succes: true,
          token: token
        });
      }
      else{
        res.status(200).json({
          status: 'Login succesful!',
          succes: true,
          token: token
        });
      }
    });
  })(req,res,next);
});

router.get('/logout',function(req,res){
  console.log(req);
  req.logOut();
  res.status(200),json({
    status: 'Bye!'
  });
});

module.exports = router;
