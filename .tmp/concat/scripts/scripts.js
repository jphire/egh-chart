'use strict';
/**
 * @ngdoc overview
 * @name greenhouseApp
 * @description
 * # greenhouseApp
 *
 * Main module of the application.
 */
var greenhouseApp = angular.module('greenhouseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ]).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/channels/:id', {
        templateUrl: 'views/channel.html',
        controller: 'ChannelCtrl'
      }).otherwise({ redirectTo: '/main' });
    }
  ]);
greenhouseApp.filter('reverse', function () {
  function toArray(list) {
    var k, out = [];
    if (list) {
      if (angular.isArray(list)) {
        out = list;
      } else if (typeof list === 'object') {
        for (k in list) {
          if (list.hasOwnProperty(k)) {
            out.push(list[k]);
          }
        }
      }
    }
    return out;
  }
  return function (items) {
    return toArray(items).slice().reverse();
  };
});
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp').controller('MainCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  '$location',
  '$firebase',
  function ($scope, $routeParams, $http, $location, $firebase) {
    var ref = new Firebase('https://greenhouse.firebaseio.com/channels');
    $scope.channels = $firebase(ref);
    $scope.appUrl = $location.$$host + ':' + $location.$$port;
    $scope.addChannel = function () {
      var data = $scope.fields;
      var newChannelRef = ref.push(data);
      var id = newChannelRef.path.n[1];
      var values_obj = [{
            id: id,
            data: []
          }];
      var childData = newChannelRef.child('data');
      childData.set(values_obj);
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the greenhouseApp channel
 */
angular.module('greenhouseApp').controller('ChannelCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  '$firebase',
  function ($scope, $routeParams, $http, $firebase) {
    $scope.id = $routeParams['id'];
    var channelRef = new Firebase('https://greenhouse.firebaseio.com/channels/' + $scope.id);
    $scope.channel = $firebase(channelRef);
    // create a reference to the first data series that is saved. TODO: add support for multiple series.
    var ref = new Firebase('https://greenhouse.firebaseio.com/channels/' + $scope.id + '/data/0/data');
    $scope.data = $firebase(ref.limit(20));
    Highcharts.setOptions({ global: { useUTC: false } });
    ref.once('value', function (value) {
      var vals = [], c = value.val();
      for (var i in c) {
        if (c.hasOwnProperty(i)) {
          vals.push(c[i]);
        }
      }
      $('#chart1').highcharts('StockChart', {
        series: [{
            id: $scope.id,
            data: vals
          }]
      });
    });
    // this function launches child_added events only for new children,
    // not for all which was inefficient
    ref.endAt().limit(1).on('child_added', function (child) {
      var time = child.val()[0], val = parseFloat(child.val()[1]);
      $('#chart1').highcharts().get($scope.id).addPoint([
        time,
        val
      ]);
    });
    $scope.parseDate = function (date) {
      var d = new Date(date);
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };
    $scope.addData = function () {
      if ($scope.fields && $scope.fields.value) {
        ref.push([
          Date.parse(new Date()),
          parseFloat($scope.fields.value)
        ], function (obj) {
          console.log('done', obj);
          $('#data-value')[0].value = '';
        });
      }
    };
    $scope.removeData = function () {
      var sure = confirm('Are you sure to remove all data?');
      if (sure) {
        $('#chart1').highcharts().get($scope.id).setData([]);
        ref.remove(function (obj) {
          console.log('done');
        });
      }
    };
  }
]);