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

    $scope.changePassword = function () {
    		$scope.showAlert = false;
    	  var oldPassword = $scope.fields.old
    	    , newPassword = $scope.fields.new_confirm

    	  if ($scope.fields.new_password === $scope.fields.new_confirm) {
	        
	        user.auth.changePassword($scope.user.email, oldPassword, newPassword, function (error, success) {
	        	if (!error) {
						  $scope.$apply(function () {
						    $scope.showAlert = true;
						    $scope.alertClass = "success";
						    $scope.alertMessage = "Password changed successfully.";
					    });
					  } else {
					  	$scope.$apply(function () {
						  	$scope.showAlert= true;
						  	$scope.alertClass = "danger";
						  	$scope.alertMessage = "Password change failed.";
					    });
					  }
					});
	      } else {
	      	$scope.showAlert= true;
			  	$scope.alertClass = "danger";
			  	$scope.alertMessage = "Given new passwords are not equal!";
	      }
    }
  }
]);
