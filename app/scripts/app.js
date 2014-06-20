'use strict';

/**
 * @ngdoc overview
 * @name greenhouseApp
 * @description
 * # greenhouseApp
 *
 * Main module of the application.
 */
var greenhouseApp = angular
  .module('greenhouseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chart', {
        templateUrl: 'views/chart.html',
        controller: 'ChartCtrl'
      })
      .when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
      })
      .when('/channels/:id', {
        templateUrl: 'views/channel.html',
        controller: 'ChannelCtrl'
      })
      .otherwise({
        redirectTo: '/chart'
      });
  });
