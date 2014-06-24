'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChannelsCtrl
 * @description
 * # ChannelsCtrl
 * Controller of the greenhouseApp channels
 */
angular.module('greenhouseApp')
  .controller('ChannelsCtrl', ['$scope', '$routeParams', '$http', '$location', '$firebase', function ($scope, $routeParams, $http, $location, $firebase) {
    var ref = new Firebase("https://greenhouse.firebaseio.com/channels");
    $scope.channels = $firebase(ref);
    $scope.appUrl = $location.$$host + ':' + $location.$$port;

    $scope.addChannel = function() {
        var data = $scope.fields;
        var newChannelRef = ref.push(data);
        var id = newChannelRef.path.n[1];
        var values_obj = [{id: id, data: []}];
        var childData = newChannelRef.child('data');
        childData.set(values_obj);    
    }
  }
]);
