'use strict';

/**
 * @ngdoc overview
 * @name greenhouseApp
 * @description
 * # greenhouseApp
 *
 * Main module of the application.
 */
var greenhouseApp = angular
  .module('greenhouseApp', [
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('index', {
        url: "",
        templateUrl: "views/root.html",
        resolve: {
          user: function ($q, $firebase) {
            var deferred = $q.defer();
            var ref = new Firebase("https://greenhouse.firebaseio.com/");

            var auth = new FirebaseSimpleLogin(ref, function(error, user) {
              if (error) {
                deferred.resolve(null);
              } if (user) {
                console.log('logged in:', user)
                deferred.resolve({'user': user, 'auth': auth, 'fb':ref});
              } else {
                deferred.resolve({'auth': auth});
              }
            });
            return deferred.promise;
          }
        },
        controller: "RootCtrl"
      })
        .state('index.users', {
          abstract: true,
          url: "/users",
          templateUrl: "views/user.html",
          controller: "UserCtrl"
        })
          .state('index.users.main', {
            url: "/:uid",
            templateUrl: "views/main.html",
            controller: "MainCtrl"
          })
          .state('index.users.channel', {
            url: "/:uid/channels/:cid",
            templateUrl: "views/channel.html",
            controller: "ChannelCtrl"
          })
          .state('index.users.settings', {
            url: "/:uid/settings",
            templateUrl: "views/settings.html",
            controller: "SettingsCtrl"
          })
        .state('index.signup', {
          url: '/signup',
          templateUrl: 'views/signup.html',
          controller: 'SignupCtrl'
        })
        .state('index.login', {
          url: '/login',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        })

  });
