angular.module('songhop.services', [])

.factory('User', function($http, SERVER) {
	var o = {
		username: false,
		session_id: false, //TODO: sesson token should expire after x days
		favorites: [],
		newFavorites: 0
	}

	  // attempt login or signup
  	o.auth = function(username, signingUp) {

	    var authRoute;

	    if (signingUp) {
	      authRoute = 'signup';
	    } else {
	      authRoute = 'login';
	    }

    return $http.post(SERVER.url + '/' + authRoute, {username: username});
  }

	o.addSongToFavorites = function(song) {
   	 // make sure there's a song to add
    	if (!song) return false;

    	// add to favorites to front of array because you want the song to display at the top
    	o.favorites.unshift(song);
    	o.newFavorites++;

    	// persist this to the server
    return $http.post(SERVER.url + '/favorites', {session_id: o.session_id, song_id:song.song_id });
  }

	o.removeSongFromFavorites = function(song, index) {
   		// make sure there's a song to add
    	if (!song) return false;

    	// add to favorites array
    	o.favorites.splice(index, 1);

    	// persist this to the server
	    return $http({
	      method: 'DELETE',
	      url: SERVER.url + '/favorites',
	       params: { session_id: o.session_id }
	    }).success(function(data) {
	      // merge data into the queue
	      o.favorites = data;
    });	    
  }

	// gets the entire list of this user's favs from server
	o.populateFavorites = function() {
		return $http({
		  method: 'GET',
		  url: SERVER.url + '/favorites',
		  params: { session_id: o.session_id }
		}).success(function(data){
		  // merge data into the queue
		  o.favorites = data;
		});
	}

	o.favoriteCount = function() {
		return o.newFavorites;
		}

		return o;
})

.factory('Recommendations', function($http, $q, SERVER) {
  var o = {
    queue: []
  };

  var media;

  o.init = function() {
    if (o.queue.length === 0) {
      // if there's nothing in the queue, fill it.
      // this also means that this is the first call of init.
      return o.getNextSongs();

    } else {
      // otherwise, play the current song
      return o.playCurrentSong();
    }
  }

  o.getNextSongs = function() {
   	return $http({
      method: 'GET',
      url: SERVER.url + '/recommendations'
    }).success(function(data){
      // merge data into the queue
      o.queue = o.queue.concat(data);
    });
  }

   o.nextSong = function() {
    // pop the index 0 off
    o.queue.shift();

    o.haltAudio();

    // low on the queue? lets fill it up
    if (o.queue.length <= 3) {
      o.getNextSongs();
    }

  }

   o.playCurrentSong = function() {
   	var defer = $q.defer();

    // play the current song's preview
    media = new Audio(o.queue[0].preview_url);

    // when song loaded, resolve the promise to let controller know.
    media.addEventListener("loadeddata", function() {
      defer.resolve();
    });

    media.play();

    return defer.promise;
  }

  // used when switching to favorites tab
  o.haltAudio = function() {
    if (media) media.pause();
  }

  return o;
});
