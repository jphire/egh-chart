'use strict';

/**
 * @ngdoc function
 * @name greenhouseApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the greenhouseApp main page
 */
greenhouseApp
  .controller('RootCtrl', ['$scope', '$rootScope', '$state', 'user',
              function ($scope, $rootScope, $state, user) {

      console.log('rootCTRL', user)
      if (user && user.user) {
        console.log('root.js', user)
        $scope.user = user.user;
        $scope.uid = user.user.id;
        $scope.isAuthenticated = true;
      } else {
        $state.go('index.login');
      }
    
      $rootScope.$on('$stateChangeStart', 
          function(event, toState, toParams, fromState, fromParams){ 
              // transitionTo() promise will be rejected with 
              // a 'transition prevented' error
              if (!$rootScope.isAuthenticated && toState.name != 'index.signup' && toState.name != 'index.login') {
                event.preventDefault(); 
                $scope.isAuthenticated = false;
                $state.go('index.login');
              } else if ($rootScope.isAuthenticated && (toState.name == 'index' || toState.name == 'index.login' || toState.name == 'index.signup')) {
                event.preventDefault();
                $scope.isAuthenticated = true;
                $scope.user = $rootScope.user;
                $state.go('index.users.main',{uid:$scope.user.id});
              }
          });

      $scope.logout = function () {
        console.log('logged out');
        $rootScope.isAuthenticated = false;
        $scope.user = null;
        user.auth.logout();
        $state.go('index.login');
      }
  }
]);
