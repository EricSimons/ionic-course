angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, Recommendations, User) {


  // helper functions for loading
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-load-c"></i>',
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
    });




  // initialized, now need wrappers for fav and skip
  $scope.sendFeedback = function (bool) {

    // first, add to favorites if they favorited
    if (bool) User.addSongToFavorites($scope.currentSong);

    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    //$scope.showLoading();


    Recommendations.playNextSong()
      .then(function(){

        // turn loading off
        $scope.hideLoading();

        // update current song in scope
        $scope.currentSong = Recommendations.queue[0];

      });
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
.controller('TabsCtrl', function($scope, User) {
  // expose the number of new favorites to the scope
  $scope.favCount = User.favoriteCount;

  // method to reset new favorites to 0 when we click the fav tab
  $scope.resetFavoriteCount = function() {
    User.newFavorites = 0;
  }
  
});








