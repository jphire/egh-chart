'use strict';
/**
 * @ngdoc overview
 * @name greenhouseApp
 * @description
 * # greenhouseApp
 *
 * Main module of the application.
 */
angular.module('greenhouseApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'firebase',
  'highcharts-ng'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/chart', {
      templateUrl: 'views/chart.html',
      controller: 'ChartCtrl'
    }).when('/channels', {
      templateUrl: 'views/channels.html',
      controller: 'ChannelsCtrl'
    }).when('/channels/:id', {
      templateUrl: 'views/channel.html',
      controller: 'ChannelCtrl'
    }).otherwise({ redirectTo: '/chart' });
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp').controller('MainCtrl', [
  '$scope',
  function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp').controller('AboutCtrl', [
  '$scope',
  function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
]);