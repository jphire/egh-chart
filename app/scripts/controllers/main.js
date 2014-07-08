'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp')
  .controller('MainCtrl', ['$scope', '$stateParams', '$firebase', 'user', function ($scope, $stateParams, $firebase, user) {

    console.log('mainCTRL');
    var ref = new Firebase("https://greenhouse.firebaseio.com/users/" + $scope.user.id + "/channels");
    $scope.channels = $firebase(ref);

    $scope.addChannel = function() {
        var data = $scope.fields;
        var newChannelRef = ref.push(data);    
    }
  }
]);
