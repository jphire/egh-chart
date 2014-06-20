'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp')
  .controller('ChartCtrl', function ($scope, $routeParams, $http) {
    var trunksRef = new Firebase('https://greenhouse.firebaseio.com/channels/');
    console.log(trunksRef);

    $('#chart1').highcharts('StockChart', {
			series : []
		});
  });
