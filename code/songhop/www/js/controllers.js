angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, Recommendations, User) {


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


    Recommendations.nextSong();

    // update current song in scope, timeout to allow animation to complete
    $timeout(function() {
      $scope.currentSong = Recommendations.queue[0];

      // show loading here
      //$scope.showLoading();

    }, 200);


    Recommendations.playCurrentSong()
      .then(function(){

        $scope.hideLoading();

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








