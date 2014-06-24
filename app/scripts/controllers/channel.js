'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the greenhouseApp channel
 */
angular.module('greenhouseApp')
  .controller('ChannelCtrl', ['$scope', '$routeParams', '$http', '$firebase', function ($scope, $routeParams, $http, $firebase) {
    $scope.id = $routeParams['id'];

    // create a reference to the first data series that is saved. TODO: add support for multiple series.
    var ref = new Firebase("https://greenhouse.firebaseio.com/channels/" + $scope.id + '/data/0/data');
    $scope.data = $firebase(ref);

    $('#chart1').highcharts('StockChart', {
      series: [
        {
          id: $scope.id,
          data: []
        }
      ]
    });

    ref.on('child_added', function (child) {
      var time = child.val()[0]
        , val = parseFloat(child.val()[1])

      $('#chart1').highcharts().get($scope.id).addPoint([time, val]);
    });

    $scope.parseDate = function (date) {
      var d = new Date(date);
      return d.getDate() + '.' + (d.getMonth() + 1)  + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }

    $scope.addData = function() {
      if ($scope.fields && $scope.fields.value) {
        ref.push([Date.parse(new Date()), parseFloat($scope.fields.value)], function (obj) {
          console.log("done", obj);
          $('#data-value')[0].value = '';
        });
      }
    }

    $scope.removeData = function() {
      $('#chart1').highcharts().get($scope.id).setData([]);
      ref.remove(function (obj) {
        console.log("done");
      });
    }
  }
]);
