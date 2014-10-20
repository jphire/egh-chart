'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the greenhouseApp main page
 */



angular.module('greenhouseApp')
  .controller('SignupCtrl', ['$scope', '$state', '$firebase', function ($scope, $state, $firebase) {
    var ref = new Firebase("https://greenhouse.firebaseio.com");

    var auth = new FirebaseSimpleLogin(ref, function (error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        console.log('signup:', user)
        $state.go('index');
      } else {
        // user is logged out
      }
    });




    $scope.createUser = function() {
      var fields = $scope.fields;
      auth.createUser(fields.email, fields.password, function (error, user) {
        if (!error) {
          // Everything went ok
          var userRef = new Firebase("https://greenhouse.firebaseio.com/users/" + user.id);
          userRef.set({'id':user.id, 'email': fields.email});
          $state.go('index.login');
          alert("User account created successfully.");
        } else {  
          //not
          alert("pipi");
        }
      });
    }
  }]);
