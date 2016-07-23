'use strict';

angular.module('wordPressPostsApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<main></main>'
      })
      .when('/:site/:id', {
        template: '<postdetails></postdetails>'
		  });
  });
