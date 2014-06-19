angular.module('greenhouseApp')
  .factory('channels', ['$firebase', function($firebase) {
  	var ref = new Firebase("https://greenhouse.firebaseio.com/channels");
    return $firebase(ref);
  }]);
  