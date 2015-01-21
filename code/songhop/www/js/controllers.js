angular.module('songhop.controllers', ['ionic', 'songhop.services'])

.controller('DiscoverCtrl', function($scope, $ionicLoading, Recommendations) {

  // set loading to true first time
  $ionicLoading.show();

  // first we'll need to initialize the Rec service, get our first ones, etc
  Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];
      console.log($scope.currentSong);

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      $ionicLoading.hide();
    });




  // initialized, now need wrappers for fav and skip
  $scope.sendFeedback = function (bool) {

    // set loading to true
    $ionicLoading.show();

    Recommendations.playNextSong()
      .then(function(){

        // turn loading off
        $ionicLoading.hide();

        // update current song in scope
        $scope.currentSong = Recommendations.queue[0];

      });
  }

});