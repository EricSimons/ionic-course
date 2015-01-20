var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err, user){
    if(err){ return next(new Error("That username is already taken.")); }

    res.json(user);
  });
});

router.post('/login', function(req, res, next) {

  User.findOne(req.body, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(new Error("Can't find that user!")); }

    res.json(user);
  });
  //var user = new User(req.body);




});


router.get('/users', function(req, res, next) {
  User.find(function(err, users){
    if(err){ return next(err); }

    res.json(users);
  });
});

module.exports = router;
