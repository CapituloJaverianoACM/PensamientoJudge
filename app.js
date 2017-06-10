var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cors = require('cors');
var FacebookStrategy= require('passport-facebook').Strategy;

var config = require('./config');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected correctly to server");
});

// TODO - NOT
app.use(function(req, res, next) { //allow cross origin requests
      res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
      res.header("Access-Control-Allow-Origin", "http://localhost:4200");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,x-access-token");
      res.header("Access-Control-Allow-Credentials", true);
      next();
  });



// Require Routes
var index = require('./routes/index');
var users = require('./routes/usersRouter');
var problemRouter = require('./routes/problemRouter');
var submission = require('./routes/submissionRouter');

// view engine setup
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

// app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'profile-pictures')));
app.use(express.static(path.join(__dirname, 'assets')));

// passport config
var User = require('./models/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use Routes
app.use('/', index);
app.use('/usersAPI', users);
app.use('/submissionAPI',submission);
app.use('/problemAPI', problemRouter); // TODO - Always add API at the end to not confuse with Angular's routes.


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
      message: err.message,
      error: err
    });
});

module.exports = app;
