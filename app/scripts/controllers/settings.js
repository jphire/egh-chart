'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the greenhouseApp profile page
 */
angular.module('greenhouseApp')
  .controller('SettingsCtrl', ['$scope', '$stateParams', 'user', function ($scope, $stateParams, user) {

    console.log('settingsCTRL')   
    

    $scope.changePassword = function () {
        
    }
  }
]);
