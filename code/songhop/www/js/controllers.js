angular.module('songhop.controllers', ['ionic', 'songhop.services'])

.controller('DiscoverCtrl', function($scope, $ionicLoading, Recommendations) {

  // set loading to true first time
  $ionicLoading.show({
    template: 'Loading song recommendations...'
  });

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
    $ionicLoading.show({
      template: 'Getting next song...'
    });

    Recommendations.playNextSong()
      .then(function(){

        // turn loading off
        $ionicLoading.hide();

        // update current song in scope
        $scope.currentSong = Recommendations.queue[0];

      });
  }

});