angular.module('songhop.services', ['ionic.utils'])

.factory('Recommendations', function($q, $http, SERVER) {
  
  var o = {
    queue: []
  };

  // placeholder for the media player
  var media = document.createElement("audio");


  o.init = function() {
    var defer = $q.defer();

    o.getNextSongs().then(
      function(){
        defer.resolve();
      },
      function () {
        defer.reject();
      });


    return defer.promise;
  }

  o.getNextSongs = function() {
    var defer = $q.defer();

    $http({
      method: 'GET',
      url: SERVER.url + '/recommendations'
    }).success(function(data){

      // merge data into the queue
      o.queue = o.queue.concat(data);
      defer.resolve();

    }).error(function(err){
      defer.reject();
    });

    return defer.promise;
  }

  o.playCurrentSong = function() {
    var defer = $q.defer();

    // play the current song's preview
    media.setAttribute('src',o.queue[0].preview_url);
    media.load();


    media.addEventListener("loadeddata", function() {
      console.log('song resolved');
      defer.resolve();
    });
    //media = new Media(o.queue[0].preview_url, function() {});

    media.play();


    return defer.promise;
  }

  o.nextSong = function() {

    // pop the index 0 off
    o.queue.shift();

    // end the song
    o.haltAudio();
    

    // low on the queue? lets fill it up
    if (o.queue.length <= 3) {
      o.getNextSongs();
    }

    return true;
  }

  // used when switching to favorites tab
  o.haltAudio = function() {
    media.pause();
  }



  

  return o;
})





/**
 * A simple example service that returns some data.
 */
.factory('User', function($q, $http, $localstorage, SERVER) {
  
  var o = {
    username: '',
    token: '',
    favorites: [],
    newFavorites: 0
  }



  // check if there's a user session present
  o.detectPreviousSession = function() {
    var user = $localstorage.getObject('user');
    if (user.username) {
      return true;
    }
    
    return false;
  }

  // log this user in
  o.auth = function(username, signingUp) {
    var defer = $q.defer();

    var authRoute;

    if (signingUp) {
      authRoute = 'signup';
    } else {
      authRoute = 'login'
    }

    $http.post(SERVER.url + '/' + authRoute, {username: username})
      .success(function(data){
        $localstorage.setObject('user', data);
        defer.resolve();

      }).error(function(err, status){
        defer.reject(err, status);

      });


    return defer.promise;
  }

  // gets the entire list of this user's favs from server
  o.populateFavorites = function() {

  }

  o.addSongToFavorites = function(song) {
    // make sure there's a song to add
    if (!song) return false;

    // add to favorites array
    o.favorites.unshift(song);
    o.newFavorites++;

    return true;
  }

  o.favoriteCount = function() {
    return o.newFavorites;
  }

  return o;
});
