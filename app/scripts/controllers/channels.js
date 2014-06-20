'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp')
  .controller('ChannelsCtrl', ['$scope', '$routeParams', '$http', '$location', 'channels', function ($scope, $routeParams, $http, $location, channels) {
    var curTime = Date.parse(new Date());
    var curValue = 20;
    $scope.channels = channels;
    $scope.appUrl = $location.$$host + ':' + $location.$$port;

    $scope.addChannel = function() {
        var data = $scope.fields;
        var url = 'https://greenhouse.firebaseio.com/channels.json';
        console.log(data);
        $http({
        	url: url,
	        method: "POST",
	        data: JSON.stringify(data),
	        headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
                var values_obj = [{id: data.name, data: [[curTime, 34]]}];
                var url = 'https://greenhouse.firebaseio.com/channels/' + data.name + '/data.json';
			    console.log("Success", values_obj);
                $http({
                    url: url,
                    method: "PUT",
                    data: JSON.stringify(values_obj),
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data, status, headers, config) {
                       console.log("Success", data);
                    }); 
			});        
    }
  }
]);
