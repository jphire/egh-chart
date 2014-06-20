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
      $routeProvider.when('/channels', {
        templateUrl: 'views/channels.html',
        controller: 'ChannelsCtrl'
      }).when('/channels/:id', {
        templateUrl: 'views/channel.html',
        controller: 'ChannelCtrl'
      }).otherwise({ redirectTo: '/channels' });
    }
  ]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp').controller('ChartCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  function ($scope, $routeParams, $http) {
    var trunksRef = new Firebase('https://greenhouse.firebaseio.com/channels/');
    console.log(trunksRef);
    $('#chart1').highcharts('StockChart', { series: [] });
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
angular.module('greenhouseApp').controller('ChannelsCtrl', [
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
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp').controller('ChannelCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  '$firebase',
  function ($scope, $routeParams, $http, $firebase) {
    $scope.id = $routeParams['id'];
    var ref = new Firebase('https://greenhouse.firebaseio.com/channels/' + $scope.id + '/data/0/data');
    $scope.data = $firebase(ref);
    $('#chart1').highcharts('StockChart', {
      series: [{
          id: $scope.id,
          data: []
        }]
    });
    ref.on('child_added', function (child) {
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
      $('#chart1').highcharts().get($scope.id).setData([]);
      ref.remove(function (obj) {
        console.log('done');
      });
    };
  }
]);