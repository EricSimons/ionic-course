angular.module('songhop.controllers', ['ionic', 'songhop.services'])

.controller('DiscoverCtrl', function($scope, $ionicLoading, Recommendations) {


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


.controller('FavoritesCtrl', function($scope) {
  
});








