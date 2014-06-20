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
angular.module('greenhouseApp').factory('channel', [
  '$firebase',
  function ($firebase) {
    return {
      getChannel: function (id) {
        var ref = new Firebase('https://greenhouse.firebaseio.com/channels/' + id);
        return $firebase(ref);
      },
      getChannelData: function (id) {
        var ref = new Firebase('https://greenhouse.firebaseio.com/channels/' + id + '/data');
        var data = [];
        ref.on('value', function (child) {
          data = child.val();
        });
        return data;
      }
    };
  }
]);
angular.module('greenhouseApp').factory('channels', [
  '$firebase',
  function ($firebase) {
    var ref = new Firebase('https://greenhouse.firebaseio.com/channels');
    return $firebase(ref);
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
    var curTime = Date.parse(new Date());
    var curValue = 20;
    console.log(trunksRef);
    trunksRef.on('value', function (snapshot) {
      console.log(snapshot.val());
      $scope.data = snapshot.val();  // $scope.channels = $firebase(snapshot.val());
                                     // for(var i in snapshot.val()) {
                                     //    $scope.data[i] = snapshot.val()[i];
                                     //    console.log(snapshot.val()[i])
                                     //  }
                                     // $('#chart1').highcharts().get('test').addPoint(snapshot.val());
                                     // });
                                     // setInterval(function(){
                                     //  curTime = curTime + 4000;
                                     //  curValue = Math.floor(Math.random()*200);
                                     //  ref.push([curTime, curValue]);
                                     // }, 4000);
    });
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
  'channels',
  function ($scope, $routeParams, $http, $location, channels) {
    var curTime = Date.parse(new Date());
    var curValue = 20;
    $scope.channels = channels;
    $scope.appUrl = $location.$$host + ':' + $location.$$port;
    $scope.addChannel = function () {
      var data = $scope.fields;
      var url = 'https://greenhouse.firebaseio.com/channels.json';
      console.log(data);
      $http({
        url: url,
        method: 'POST',
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }).success(function (data, status, headers, config) {
        var values_obj = [{
              id: data.name,
              data: [[
                  curTime,
                  34
                ]]
            }];
        var url = 'https://greenhouse.firebaseio.com/channels/' + data.name + '/data.json';
        console.log('Success', values_obj);
        $http({
          url: url,
          method: 'PUT',
          data: JSON.stringify(values_obj),
          headers: { 'Content-Type': 'application/json' }
        }).success(function (data, status, headers, config) {
          console.log('Success', data);
        });
      });
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
      return d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
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