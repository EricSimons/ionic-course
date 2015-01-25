angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, Recommendations, User) {


  // helper functions for loading
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  $scope.hideLoading = function() {
    $ionicLoading.hide();
  }



  // set loading to true first time while we retrieve songs from server.
  $scope.showLoading();

  // first we'll need to initialize the Rec service, get our first songs, etc
  Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      $scope.hideLoading();
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

    // update current song in scope, timeout to allow animation to complete
    $timeout(function() {
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;


    }, 250);


    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;

    });


  }


  // used for retrieving the next album image.
  // if there isn't an album image available next, return empty string.
  $scope.nextAlbumImg = function() {
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
  $scope.username = User.username;

  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }

  $scope.openSong = function(song) {
    console.log(song.open_url);
    window.open(song.open_url, "_system");
  }

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, $state, User, Recommendations, hasSession) {
  // need to make sure this user is logged in. otherwise, send to splash
  if (!hasSession) $state.go('splash');


  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

  // method to reset new favorites to 0 when we click the fav tab
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

  $scope.logout = function() {
    User.destroySession();
    $state.go('splash');
  }

  

})


/*
Controller for the splash page
*/
.controller('SplashCtrl', function($scope, $state, User) {

  // Detect if there's an existing session in localstorage
  User.checkSession().then(function(signedIn) {
    if (signedIn) $state.go('tab.discover');
  });


  // get the list of our favorites from the user service
  $scope.submitForm = function(username, signingUp) {
    User.auth(username, signingUp).then(function(){
      // session is now set, so lets redirect to discover page
      $state.go('tab.discover');

    }, function(err, status) {
      // error handling here
      alert(err);

    });
  }

});








