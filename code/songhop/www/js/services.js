angular.module('songhop.services', ['ionic.utils'])

.factory('Recommendations', function($q, $http, SERVER) {
  
  var o = {
    queue: []
  };

  // placeholder for the media player
  var media;


  o.init = function() {
    var defer = $q.defer();

    // if there's nothing in the queue, fill it.
    if (o.queue == 0) {
      o.getNextSongs().then(
        function(){
          defer.resolve();
        },
        function () {
          defer.reject();
        });

    // otherwise, play the current song
    } else {
      o.playCurrentSong();
    }


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
    media = new Audio(o.queue[0].preview_url);


    media.addEventListener("loadeddata", function() {
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
    if (media) media.pause();
  }



  

  return o;
})





/**
 * A simple example service that returns some data.
 */
.factory('User', function($q, $http, $localstorage, SERVER) {
  
  var o = {
    username: false,
    session_id: false,
    favorites: [],
    newFavorites: 0
  }



  // check if there's a user session present
  o.checkSession = function() {
    var defer = $q.defer();

    // if this session is already initialized in the service
    if (o.session_id) {
      defer.resolve(true);

    // detect if there's a session in localstorage
    // if it is, pull into our service
    } else {

      var user = $localstorage.getObject('user');
      // if there's a user, lets grab their favorites from the server
      if (user.username) {
        o.setSession(user.username, user.session_id);
        o.populateFavorites().then(function() {
          defer.resolve(true);
        });

      } else {
        defer.resolve(false);
      }

    }

    return defer.promise;
  }


  // set session data
  o.setSession = function(username, session_id, favorites) {
    if (username) o.username = username;
    if (session_id) o.session_id = session_id;
    if (favorites) o.favorites = favorites;

    // set localstorage object
    $localstorage.setObject('user', { username: username, session_id: session_id });
  }

  // wipe out our session data
  o.destroySession = function() {
    $localstorage.setObject('user', {});
    o.username = false;
    o.session_id = false;
    o.favorites = 0;
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
        o.setSession(data.username, data.session_id, data.favorites);
        defer.resolve();

      }).error(function(err, status){
        defer.reject(err, status);

      });


    return defer.promise;
  }

  // gets the entire list of this user's favs from server
  o.populateFavorites = function() {
    var defer = $q.defer();

    $http({
      method: 'GET',
      url: SERVER.url + '/favorites',
      params: { session_id: o.session_id }
    }).success(function(data){

      // merge data into the queue
      o.favorites = data;
      defer.resolve();

    }).error(function(err){
      defer.reject();
    });

    return defer.promise;
  }

  o.addSongToFavorites = function(song) {
    // make sure there's a song to add
    if (!song) return false;

    // add to favorites array
    o.favorites.unshift(song);
    o.newFavorites++;

    // persist this to the server
    $http.post(SERVER.url + '/favorites', {session_id: o.session_id, song_id:song.song_id })
      .success(function(data){
        // nailed it!

      }).error(function(err, status){
        // something went wrong, let the user know.
        alert(err);

      });

    return true;
  }

    o.removeSongFromFavorites = function(song, index) {
    // make sure there's a song to add
    if (!song) return false;

    // add to favorites array
    o.favorites.splice(index, 1);

    // persist this to the server
    $http({
      method: 'DELETE',
      url: SERVER.url + '/favorites',
      params: 
        {
          session_id: o.session_id,
          song_id:song.song_id
        }

    }).success(function(data){
        // nailed it!

      }).error(function(err, status){
        // something went wrong, let the user know.
        alert(err);

      });

    return true;
  }

  o.favoriteCount = function() {
    return o.newFavorites;
  }

  return o;
});
