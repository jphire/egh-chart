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
    var auth = new FirebaseSimpleLogin(ref, function(error, logged_user) {
      if (error) {
        console.log(error);
      } else if (logged_user) {
        console.log('login.js:', logged_user)
        $rootScope.isAuthenticated = true;
        $rootScope.user = logged_user;
        $state.go('index');
      } else {
        // logged out
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
