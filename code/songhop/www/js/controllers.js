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



  // set loading to true first time
  $scope.showLoading();

  // first we'll need to initialize the Rec service, get our first ones, etc
  Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];
      console.log($scope.currentSong);

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      $scope.hideLoading();
      $scope.currentSong.loaded = true;
    });




  // initialized, now need wrappers for fav and skip
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


  $scope.nextAlbumImg = function() {
    return Recommendations.queue[1].image_large;
  }

})





/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

  // method to reset new favorites to 0 when we click the fav tab
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.playCurrentSong();
  }

  

});








