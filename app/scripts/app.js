'use strict';

/**
 * @ngdoc overview
 * @name greenhouseApp
 * @description
 * # greenhouseApp
 *
 * Main module of the application.
 */
angular
  .module('greenhouseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'highcharts-ng'
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
