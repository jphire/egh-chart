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
    var curTime = Date.parse(new Date());
    var curValue = 20;
      console.log(trunksRef);

    trunksRef.on("value", function(snapshot) {
        console.log(snapshot.val());
        $scope.data = snapshot.val();
        // $scope.channels = $firebase(snapshot.val());
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


    $('#chart1').highcharts('StockChart', {
			series : []
		});
  });
