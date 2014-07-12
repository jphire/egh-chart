'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$firebase', 'user', function ($scope, $rootScope, $state, $firebase, user) {

    console.log('loginCTRL', user)
    var ref = new Firebase("https://greenhouse.firebaseio.com/");
    $scope.showAlert = false;
    
    var auth = new FirebaseSimpleLogin(ref, function(error, logged_user) {
      if (error) {
        console.log(error);
        $scope.$apply(function () {
          $scope.showAlert = true;
          $scope.alertClass = "danger";
          $scope.alertMessage = "Login failed.";
        });
      } else if (logged_user) {
        console.log('login.js:', logged_user)
        $scope.$apply(function () {
          $scope.showAlert = false;
          $rootScope.isAuthenticated = true;
          $rootScope.user = logged_user;
        });
        $state.go('index');
      } else {
        // logged out
        $scope.$apply(function () {
          $scope.showAlert = false;
        });
      }
    });

    $scope.loginUser = function () {
      var fields = $scope.fields;
      auth.login('password', {
        email: fields.email,
        password: fields.password  
      })
    }
  }
]);
