var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');

// used for shuffling songs array
function shuffle(o){
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/recommendations', function(req, res) {
  Song.find(function(err, songs) {
    if (err) { return next(err); }

    songs = shuffle(songs.splice(0,10));
    res.json(songs);
  })
});

router.get('/favorites', function(req, res) {
  User.findById(req.query.session_id)
  .populate('favorites')
  .exec(function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(new Error("Can't find that user!")); }

    user.favorites.reverse();
    res.json(user.favorites);
  });
});

router.post('/favorites', function(req, res, next) {

  User.findByIdAndUpdate(
    req.body.session_id,
    {$push: {"favorites": req.body.song_id }},
    {safe: true, upsert: true},
    function(err, model) {
      if(err){ return next(new Error("Something went wrong favoriting that song.")); }

      res.json({success: true});
    }
  );

});

router.delete('/favorites', function(req, res, next) {

  User.findByIdAndUpdate(
    req.query.session_id,
    {$pull: {"favorites": req.query.song_id }},
    {safe: true, upsert: true},
    function(err, model) {
      if(err){ return next(new Error("Something went wrong removing that song.")); }

      res.json({success: true});
    }
  );

});


router.post('/signup', function(req, res, next) {
  var user = new User(req.body);

  user.save(function(err, user){
    if(err){ return next(new Error("That username is already taken.")); }

    res.json(user);
  });
});

router.post('/login', function(req, res, next) {

  User.findOne(req.body)
  .populate('favorites')
  .exec(function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(new Error("Can't find that user!")); }

    user.favorites.reverse();
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
