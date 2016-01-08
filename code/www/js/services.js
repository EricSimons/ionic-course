angular.module('songhop.services', [])

.factory('User', function() {
	var o = {
		favorites: []
	}

	o.addSongToFavorites = function(song) {
   	 // make sure there's a song to add
    	if (!song) return false;

    	// add to favorites to front of array because you want the song to display at the top
    	o.favorites.unshift(song);
  }

   	o.removeSongFromFavorites = function(song, index) {
   		// make sure there's a song to add
    	if (!song) return false;

    	// add to favorites array
    	o.favorites.splice(index, 1);
  }

	return o;
});
