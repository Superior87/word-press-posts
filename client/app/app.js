'use strict';

angular.module('wordPressPostsApp', ['wordPressPostsApp.constants', 'ngCookies', 'ngResource',
    'ngSanitize', 'ngRoute', 'ui.bootstrap'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
  });
