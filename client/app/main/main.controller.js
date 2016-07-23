'use strict';

(function() {

  class MainController {

    constructor($http, PostService) {
      this.$http = $http;
      this.PostService = PostService;
      
      this.wpPosts = [];
      this.pageDomain = '';
      this.searchPhrase = '';
      this.sortOptions = [ 
        { id: '1', label: 'Last created', orderAttr: 'date', orderType: 'DESC' },
        { id: '2', label: 'First created', orderAttr: 'date', orderType: 'ASC' },
        { id: '3', label: 'Last modified', orderAttr: 'modified', orderType: 'DESC' },
        { id: '4', label: 'First modified', orderAttr: 'modified', orderType: 'ASC' },
        { id: '5', label: 'Title ascending', orderAttr: 'title', orderType: 'ASC' },
        { id: '6', label: 'Title descending', orderAttr: 'title', orderType: 'DESC' }
      ];
      this.sortBy = this.sortOptions[0];
      this.maxResults = 10;
      this.alert = null;
      this.dataLoaded = null;
    }

    $onInit() {
      if(this.PostService.storage != null) {
        this.wpPosts = this.PostService.storage.wpPosts;
        this.pageDomain = this.PostService.storage.pageDomain;
        this.searchPhrase = this.PostService.storage.searchPhrase;
        this.sortBy = this.PostService.storage.sortBy;
        this.maxResults = this.PostService.storage.maxResults;
        this.dataLoaded = true;
      }
    }

    $onDestroy() {
      var data = {
        wpPosts: this.wpPosts,
        pageDomain: this.pageDomain,
        searchPhrase: this.searchPhrase,
        sortBy: this.sortBy,
        maxResults: this.maxResults
      };
      this.PostService.UpdateStorage(data);
    }

    searchPosts(formCtrl) {
      if(formCtrl.$valid) {
        this.dataLoaded = false;
        var url = 'https://public-api.wordpress.com/rest/v1.1/sites/' + this.pageDomain + '/posts/';
        url += '?fields=ID,site_ID,title,author,date,URL'; //ask only for required data
        url += '&order_by=' + this.sortBy.orderAttr;
        url += '&order=' + this.sortBy.orderType;
        url += '&number=' + this.maxResults;
        if(this.searchPhrase != '') {
          url += '&search=' + this.searchPhrase;
        }
        
        this.$http.get(url).then(
          successResponse => {
            this.alert = null;
            this.dataLoaded = true;
            this.wpPosts = successResponse.data.posts;
          }, errorResponse => {
            this.wpPosts = [];
            this.dataLoaded = null;
            if(errorResponse.data == '') {
              this.alert = 'There was an unexpected error. Please try again later.';
            } else {
              this.alert = errorResponse.data.message;
            }
          }
        );
      }
    }
  }

  angular.module('wordPressPostsApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    })
    
    .factory('PostService', function() {
      var postService = {};
      postService.UpdateStorage = function (data) {
        postService.storage = data;
      };
      return postService;
    });
})();
