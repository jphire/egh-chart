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
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ]).config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');
      $stateProvider.state('index', {
        url: '',
        templateUrl: 'views/root.html',
        resolve: {
          user: [
            '$q',
            '$firebase',
            function ($q, $firebase) {
              var deferred = $q.defer();
              var ref = new Firebase('https://greenhouse.firebaseio.com/');
              var auth = new FirebaseSimpleLogin(ref, function (error, user) {
                  if (error) {
                    deferred.resolve(null);
                  }
                  if (user) {
                    console.log('logged in:', user);
                    deferred.resolve({
                      'user': user,
                      'auth': auth,
                      'fb': ref
                    });
                  } else {
                    deferred.resolve({ 'auth': auth });
                  }
                });
              return deferred.promise;
            }
          ]
        },
        controller: 'RootCtrl'
      }).state('index.users', {
        abstract: true,
        url: '/users',
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      }).state('index.users.main', {
        url: '/:uid',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).state('index.users.channel', {
        url: '/:uid/channels/:cid',
        templateUrl: 'views/channel.html',
        controller: 'ChannelCtrl'
      }).state('index.users.settings', {
        url: '/:uid/settings',
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      }).state('index.signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      }).state('index.login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      });
    }
  ]);
greenhouseApp.filter('reverse', function () {
  function toArray(list) {
    var k, out = [];
    if (list) {
      if (angular.isArray(list)) {
        out = list;
      } else if (typeof list === 'object') {
        for (k in list) {
          if (list.hasOwnProperty(k)) {
            out.push(list[k]);
          }
        }
      }
    }
    return out;
  }
  return function (items) {
    return toArray(items).slice().reverse();
  };
});
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the greenhouseApp main page
 */
greenhouseApp.controller('RootCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  'user',
  function ($scope, $rootScope, $state, $stateParams, user) {
    console.log('rootCTRL', user);
    if (user && user.user) {
      console.log('root.js', user);
      $scope.user = user.user;
      $scope.uid = user.user.id;
      $rootScope.isAuthenticated = true;
      $scope.isAuthenticated = true;
      if (Object.keys($stateParams).length == 0) {
        $state.go('index.users.main', { uid: $scope.uid });
      }
    } else {
      $state.go('index.login');
    }
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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
        $state.go('index.users.main', { uid: $scope.user.id });
      }
    });
    $scope.logout = function () {
      console.log('logged out');
      $rootScope.isAuthenticated = false;
      $scope.user = null;
      user.auth.logout();
      $state.go('index.login');
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the greenhouseApp user page
 */
angular.module('greenhouseApp').controller('UserCtrl', [
  '$scope',
  '$stateParams',
  'user',
  function ($scope, $stateParams, user) {
    console.log('userCTRL', $stateParams.uid);
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp').controller('SignupCtrl', [
  '$scope',
  '$state',
  '$firebase',
  function ($scope, $state, $firebase) {
    var ref = new Firebase('https://greenhouse.firebaseio.com');
    var auth = new FirebaseSimpleLogin(ref, function (error, user) {
        if (error) {
          // an error occurred while attempting login
          console.log(error);
        } else if (user) {
          // user authenticated with Firebase
          console.log('signup:', user);
          $state.go('index');
        } else {
        }
      });
    $scope.createUser = function () {
      var fields = $scope.fields;
      auth.createUser(fields.email, fields.password, function (error, user) {
        if (!error) {
          // Everything went ok
          var userRef = new Firebase('https://greenhouse.firebaseio.com/users/' + user.id);
          userRef.set({
            'id': user.id,
            'email': fields.email
          });
          $state.go('index.login');
          alert('User account created successfully.');
        } else {
          //not
          alert('pipi');
        }
      });
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp').controller('LoginCtrl', [
  '$scope',
  '$rootScope',
  '$state',
  '$firebase',
  'user',
  function ($scope, $rootScope, $state, $firebase, user) {
    console.log('loginCTRL', user);
    var ref = new Firebase('https://greenhouse.firebaseio.com/');
    $scope.showAlert = false;
    var auth = new FirebaseSimpleLogin(ref, function (error, logged_user) {
        if (error) {
          console.log(error);
          $scope.$apply(function () {
            $scope.showAlert = true;
            $scope.alertClass = 'danger';
            $scope.alertMessage = 'Login failed.';
          });
        } else if (logged_user) {
          console.log('login.js:', logged_user);
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
      });
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the greenhouseApp profile page
 */
angular.module('greenhouseApp').controller('SettingsCtrl', [
  '$scope',
  '$stateParams',
  'user',
  function ($scope, $stateParams, user) {
    $scope.changePassword = function () {
      $scope.showAlert = false;
      var oldPassword = $scope.fields.old, newPassword = $scope.fields.new_confirm;
      if ($scope.fields.new_password === $scope.fields.new_confirm) {
        user.auth.changePassword($scope.user.email, oldPassword, newPassword, function (error, success) {
          if (!error) {
            $scope.$apply(function () {
              $scope.showAlert = true;
              $scope.alertClass = 'success';
              $scope.alertMessage = 'Password changed successfully.';
            });
          } else {
            $scope.$apply(function () {
              $scope.showAlert = true;
              $scope.alertClass = 'danger';
              $scope.alertMessage = 'Password change failed.';
            });
          }
        });
      } else {
        $scope.showAlert = true;
        $scope.alertClass = 'danger';
        $scope.alertMessage = 'Given new passwords are not equal!';
      }
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the greenhouseApp main page
 */
angular.module('greenhouseApp').controller('MainCtrl', [
  '$scope',
  '$stateParams',
  '$firebase',
  'user',
  function ($scope, $stateParams, $firebase, user) {
    console.log('mainCTRL');
    var ref = new Firebase('https://greenhouse.firebaseio.com/users/' + $scope.user.id + '/channels');
    $scope.channels = $firebase(ref);
    $scope.addChannel = function () {
      var data = $scope.fields;
      var newChannelRef = ref.push(data);
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name greenhouseApp.controller:ChannelCtrl
 * @description
 * # ChannelCtrl
 * Controller of the greenhouseApp channel
 */
angular.module('greenhouseApp').controller('ChannelCtrl', [
  '$scope',
  '$stateParams',
  '$firebase',
  'user',
  function ($scope, $stateParams, $firebase, user) {
    $scope.cid = $stateParams.cid;
    var channelRef = new Firebase('https://greenhouse.firebaseio.com/users/' + $scope.user.id + '/channels/' + $scope.cid);
    $scope.channel = $firebase(channelRef);
    // create a reference to the first data series that is saved. TODO: add support for multiple series.
    var dataRef = new Firebase('https://greenhouse.firebaseio.com/users/' + $scope.user.id + '/channels/' + $scope.cid + '/data'), series = {};
    $scope.data = {};
    $scope.showMore = false;
    $scope.updown = 'down';
    Highcharts.setOptions({ global: { useUTC: false } });
    dataRef.once('value', function (value) {
      var vals = [], tmp_series = [], c = value.val();
      for (var s in c) {
        if (c.hasOwnProperty(s)) {
          vals = [];
          for (var d in c[s].data) {
            if (c[s].data.hasOwnProperty(d)) {
              vals.push(c[s].data[d]);
            }
          }
          tmp_series.push({
            id: c[s].id,
            name: c[s].name,
            data: vals,
            unit: c[s].unit || ''
          });
        }
      }
      $('#chart1').highcharts('StockChart', {
        chart: {
          type: 'area',
          zoomType: 'x'
        },
        credits: { enabled: false },
        legend: { enabled: true },
        rangeSelector: { allButtonsEnabled: true },
        tooltip: {
          formatter: function () {
            var s = '<b>' + Highcharts.dateFormat('%A, %b %e, %Y %H:%M:%S', this.x) + '</b>';
            for (var p = 0; p < this.points.length; p++) {
              s += '<br/><b>' + this.points[p].series.name + ':</b> ' + Math.round(this.points[p].y * 100) / 100 + ' ' + this.points[p].series.options.unit;
            }
            return s;
          }
        },
        series: tmp_series
      });
    });
    // listen to every series separately, some limit to series amount should be added
    dataRef.on('child_added', function (value) {
      var series_url = 'https://greenhouse.firebaseio.com/users/' + $scope.uid + '/channels/' + $scope.cid + '/data/' + value.name() + '/data';
      $scope.series_id = value.name();
      series[value.val().id] = new Firebase(series_url);
      series[value.val().id].endAt().limit(1).on('child_added', function (child) {
        var time = child.val()[0], val = parseFloat(child.val()[1]);
        $('#chart1').highcharts().get(value.val().id).addPoint([
          time,
          val
        ]);
      });
      $scope.data[value.val().id] = {
        val: $firebase(series[value.val().id].limit(1)),
        unit: value.val().unit,
        key: value.name()
      };
    });
    $scope.switchMore = function () {
      $scope.updown = $scope.updown == 'up' ? 'down' : 'up';
      $scope.showMore = !$scope.showMore;
    };
    $scope.parseDate = function (date) {
      var d = new Date(date);
      return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    };
    $scope.addSeries = function () {
      if ($scope.fields && $scope.fields.id && $scope.fields.unit) {
        dataRef.push({
          id: $scope.fields.id,
          name: $scope.fields.id,
          unit: $scope.fields.unit
        }, function (obj) {
          console.log('done', obj);
          $('#data-id')[0].value = '';
          $('#data-unit')[0].value = '';
          alert('Series added!');
        });
      }
    };
    $scope.removeSeries = function (name) {
      var sure = confirm('Are you sure to remove series data?');
      if (sure) {
        if ($('#chart1').highcharts().get(name)) {
          $('#chart1').highcharts().get(name).remove();
        }
        delete $scope.data[name];
        // Should delete all data, now the channel remains as a ghost
        series[name].parent().remove(function (obj) {
          console.log('done');
        });
      }
    };
    $scope.roundVal = function (val) {
      return Math.round(val * 100) / 100;
    }  // for debugging purposes
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
;
  }
]);