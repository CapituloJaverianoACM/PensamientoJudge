var express = require('express');
var router = express.Router();
var path = require('path');

router.use(express.static(path.join(__dirname, 'public')));
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});

router.get('/about', function(req, res, next) {
  //res.render('prob', { title: 'Express' });
  res.sendfile(__dirname + '/public/problems.html');
});

module.exports = router;
