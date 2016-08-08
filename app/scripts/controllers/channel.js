'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the greenhouseApp channel
 */
angular.module('greenhouseApp')
  .controller('ChannelCtrl', ['$scope', '$stateParams', '$firebase', 'user', function ($scope, $stateParams, $firebase, user) {

    $scope.cid = $stateParams.cid;

    var channelRef = new Firebase("https://greenhouse.firebaseio.com/users/" + $stateParams.uid + "/channels/" + $scope.cid);
    $scope.channel = $firebase(channelRef);

    // create a reference to the first data series that is saved. TODO: add support for multiple series.
    var dataRef = new Firebase("https://greenhouse.firebaseio.com/users/" + $stateParams.uid + "/channels/" + $scope.cid + '/data')
      , series = {}

    $scope.data = {};
    $scope.showMore = false;
    $scope.updown = 'down';

    Highcharts.setOptions({
      global: {
        useUTC: false
      }
    });

    dataRef.once('value', function (value) {
      var vals = []
        , tmp_series = []
        , c = value.val()

      for (var s in c) {
        if (c.hasOwnProperty(s)) {
          vals = [];
          for (var d in c[s].data) {
            if (c[s].data.hasOwnProperty(d)) {
              vals.push(c[s].data[d]);
            }
          }
          tmp_series.push({id: c[s].id, name: c[s].name, data: vals, unit: (c[s].unit || '')});
        }
      }
      
      $('#chart1').highcharts('StockChart', {
        chart: {
          type: "area",
          zoomType: "x"
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: true
        },
        rangeSelector: {
          allButtonsEnabled: true
        },
        tooltip: {
          formatter: function () {
            var s = '<b>'+ Highcharts.dateFormat('%A, %b %e, %Y %H:%M:%S', this.x) +'</b>';
            for (var p = 0; p < this.points.length; p++) {
              s += '<br/><b>' + this.points[p].series.name + ':</b> ' + (Math.round(this.points[p].y*100)/100) + ' ' + this.points[p].series.options.unit;
            }
            return s;
          }
        },
        series: tmp_series
      });
    });


    // listen to every series separately, some limit to series amount should be added
    dataRef.on('child_added', function (value) {
      var series_url = "https://greenhouse.firebaseio.com/users/" + $scope.uid + "/channels/" + $scope.cid + '/data/' + value.name() + '/data';
      $scope.series_id = value.name();
      series[value.val().id] = new Firebase(series_url);
      
      series[value.val().id].endAt().limit(1).on('child_added', function (child) {
          var time = child.val()[0]
            , val = parseFloat(child.val()[1])
          $('#chart1').highcharts().get(value.val().id).addPoint([time, val]);
      });
      $scope.data[value.val().id] = {val:$firebase(series[value.val().id].limit(1)), unit:value.val().unit, key:value.name()};
    })

    $scope.switchMore = function () {
      $scope.updown = $scope.updown == 'up' ? 'down' : 'up';
      $scope.showMore = !$scope.showMore;
    }

    $scope.parseDate = function (date) {
      var d = new Date(date);
      return d.getDate() + '.' + (d.getMonth() + 1)  + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }

    $scope.addSeries = function() {
      if ($scope.fields && $scope.fields.id && $scope.fields.unit) {
        dataRef.push({id:$scope.fields.id, name:$scope.fields.id, unit:$scope.fields.unit}, function (obj) {
          console.log("done", obj);
          $('#data-id')[0].value = '';
          $('#data-unit')[0].value = '';
          alert("Series added!");
        });
      }
    }

    $scope.removeSeries = function(name) {
      var sure = confirm("Are you sure to remove series data?");
      if (sure) {
        if ($('#chart1').highcharts().get(name)) {
          $('#chart1').highcharts().get(name).remove();
        }
        delete $scope.data[name];
        // Should delete all data, now the channel remains as a ghost
        
        series[name].parent().remove(function (obj) {
          console.log("done");
        });
      }
    }

    $scope.roundVal = function (val) {
      return Math.round(val*100)/100;
    }
    
    // for debugging purposes
    // $scope.addData = function() {
    //   series['another'].push([Date.parse(new Date()), (Math.random()*23)], function (obj) {
    //     console.log("done a", obj);
    //   });
    //   series['yetanother'].push([Date.parse(new Date()), (Math.random()*10)], function (obj) {
    //     console.log("done y", obj);
    //   });
    //   series['tedstin'].push([Date.parse(new Date()), (Math.random()*100)], function (obj) {
    //     console.log("done t", obj);
    //   });
    // }
  }
]);
