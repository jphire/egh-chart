'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the greenhouseApp user page
 */
angular.module('greenhouseApp')
  .controller('UserCtrl', ['$scope', '$stateParams', 'user', function ($scope, $stateParams, user) {
    
    console.log('userCTRL', $stateParams.uid)
  }
]);
