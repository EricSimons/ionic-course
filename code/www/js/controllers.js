angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {
// helper functions for loading
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  // set loading to true first time while we retrieve songs from server.
  showLoading();
// get our first songs
 Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
    });

   // fired when we favorite / skip a song.
   $scope.sendFeedback = function (bool) {
   	// first, add to favorites if they favorited
    if (bool) User.addSongToFavorites($scope.currentSong);

    // set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

     // prepare the next song
    Recommendations.nextSong();

    $timeout(function() {
      // $timeout to allow animation to complete
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;
    })

  }

  $scope.nextAlbumImage = function() {
  	if (Recommendations.queue.length > 1) {
  		return Recommendations.queue[1].image_large;
  	}

  	return '';
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
	// get the list of our favorites from the user service
	$scope.favorites = User.favorites;

	$scope.removeSong = function(song, index) {
    	User.removeSongFromFavorites(song, index);
  }

  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
// stop audio when going to favorites page
$scope.enteringFavorites = function() {
    Recommendations.haltAudio();
    User.newFavorites = 0;
  }

$scope.leavingFavorites = function() {
    Recommendations.init();
  } 

  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

})

.controller('SplashCtrl', function($scope, $state, x	User) {
	// attempt to signup/login via User.auth
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function() {
      // session is now set, so lets redirect to discover page
      $state.go('tab.discover');

    }, function() {
      // error handling here
      alert('Hmmm... try another username.');
    });
  }

});