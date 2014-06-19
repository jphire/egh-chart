'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
