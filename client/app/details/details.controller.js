'use strict';

(function() {

  class DetailsController {

    constructor($http, $routeParams) {
      this.$http = $http;
      this.site = $routeParams.site;
      this.postId = $routeParams.id;
      this.wpPost = {};
      this.alert = null;
      this.dataLoaded = null;
    }

    $onInit() {
      this.dataLoaded = false;
      var url = 'https://public-api.wordpress.com/rest/v1.1/sites/' + this.site + '/posts/' + this.postId;
      url += '?fields=ID,title,content,URL'; //ask only for required data
      
      this.$http.get(url).then(
        successResponse => {
          this.alert = null;
          this.dataLoaded = true;
          this.wpPost = successResponse.data;
        }, errorResponse => {
          this.wpPost = {};
          this.dataLoaded = null;
          if(errorResponse.data == '') {
            this.alert = 'There was an unexpected error. Please try again later.';
          } else {
            this.alert = errorResponse.data.message;
          }
        }
      );
    }

    goBack() {
        window.history.back();
    }
  }

  angular.module('wordPressPostsApp')
    .component('postdetails', {
      templateUrl: 'app/details/details.html',
      controller: DetailsController
    });
})();
