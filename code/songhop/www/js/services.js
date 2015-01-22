angular.module('songhop.services', [])

.factory('Recommendations', function($q, $http, $timeout) {
  
  var o = {
    queue: []
  };


  o.init = function() {
    var defer = $q.defer();

    o.getNextSongs().then(
      function(){
        return defer.resolve();
      },
      function () {
        return defer.reject();
      });


    return defer.promise;
  }

  o.getNextSongs = function() {
    var defer = $q.defer();

    $http({
      method: 'GET',
      url: 'http://localhost:3000/recommendations'
    }).success(function(data){

      // merge data into the queue
      o.queue = o.queue.concat(data);
      return defer.resolve();

    }).error(function(err){
      return defer.reject();
    });

    return defer.promise;
  }

  o.playCurrentSong = function() {
    var defer = $q.defer();

    // this is where the loading block will go for cordova media plugin
    $timeout(function() {
      return defer.resolve();
    }, 200);

    return defer.promise;
  }

  o.playNextSong = function() {
    // pop the index 0 off
    o.queue.shift();

    // low on the queue? lets fill it up
    if (o.queue.length <= 3) {
      o.getNextSongs();
    }

    return o.playCurrentSong();
  }



  

  return o;
})





/**
 * A simple example service that returns some data.
 */
.factory('User', function() {
  
  var o = {
    username: 'eric',
    favorites: []
  }

  return o;
});
