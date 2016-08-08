'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the greenhouseApp
 */
angular.module('greenhouseApp')
  .controller('MapCtrl', function ($scope, $routeParams, $http) {
    // var trunksRef = new Firebase('https://greenhouse.firebaseio.com/map/');
    // console.log(trunksRef);
    var targets = {};

    $.getJSON("assets/participants2012.json", function( geojson ) {
    // do whatever you want
    	for (var i in geojson) {
    		if (geojson.hasOwnProperty(i)) {
    			targets[geojson[i]['response_id']] = geojson[i];
    			var circle = L.circle([geojson[i].latitude, geojson[i].longitude], 60000, {
				    color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.4
				}).addTo(map);
    		} 
    	}
    	console.log("DATA", targets);
	});
	//console.log('dataaa', Highcharts.geojson(Highcharts.maps['custom/north-america-no-central']));
	var map = L.map('map').setView([39.50, -98.35], 4);

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18
	}).addTo(map);

	function onMapClick(e) {
	    console.log("You clicked the map at ", e,  targets['' + e.latlng.lat + e.latlng.lng]);
	}

	map.on('click', onMapClick);


	console.log(map)
  });
