'use strict';

describe('Component: mainComponent', function() {

  // load the controller's module
  beforeEach(module('wordPressPostsApp'));

  var scope;
  var mainComponent;
  var $httpBackend;
  var postService;
  
  //Initialize mock data
  var MOCK_POSTS = [
    {
      ID: 0,
      site_ID: 0,
      title: 'some title 0'
    },
    {
      ID: 1,
      site_ID: 0,
      title: 'some title 1'
    }
  ];
  var MOCK_PAGE_DOMAIN = 'some_site';
  var MOCK_SEARCH_PHRASE = 'some phrase';
  var MOCK_SORT_BY = { id: '5', label: 'Title ascending', orderAttr: 'title', orderType: 'ASC' };
  var MOCK_MAX_RESULTS = 7;
  var MOCK_ERROR_RESPONSE_DATA = { "error":"unknown_blog","message":"Unknown blog" };

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope, PostService) {
    $httpBackend = _$httpBackend_;
    
    scope = $rootScope.$new();
    postService = PostService;
    mainComponent = $componentController('main', {
      $http: $http,
      $scope: scope
    });
    
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it('should not load data from storage on first run', function() {
    mainComponent.$onInit();
    
    //check default values
    expect(postService.storage).toBeUndefined();
    expect(mainComponent.wpPosts).toEqual([]);
    expect(mainComponent.pageDomain).toBe('');
    expect(mainComponent.searchPhrase).toBe('');
    expect(mainComponent.sortBy).toBe(mainComponent.sortOptions[0]);
    expect(mainComponent.maxResults).toBe(10);
    expect(mainComponent.dataLoaded).toBe(null);
  });

  it('should save data to storage on exit', function() {
    //set values
    mainComponent.wpPosts = MOCK_POSTS;
    mainComponent.pageDomain = MOCK_PAGE_DOMAIN;
    mainComponent.searchPhrase = MOCK_SEARCH_PHRASE;
    mainComponent.sortBy = MOCK_SORT_BY;
    mainComponent.maxResults = MOCK_MAX_RESULTS;

    mainComponent.$onDestroy();
    
    //check values
    expect(postService.storage).toBeDefined();
    expect(postService.storage.wpPosts).toEqual(MOCK_POSTS);
    expect(postService.storage.pageDomain).toBe(MOCK_PAGE_DOMAIN);
    expect(postService.storage.searchPhrase).toBe(MOCK_SEARCH_PHRASE);
    expect(postService.storage.sortBy).toBe(MOCK_SORT_BY);
    expect(postService.storage.maxResults).toBe(MOCK_MAX_RESULTS);
  });

  it('should load data from storage on another run', function() {
    mainComponent.$onInit();
    
    //set values
    mainComponent.wpPosts = MOCK_POSTS;
    mainComponent.pageDomain = MOCK_PAGE_DOMAIN;
    mainComponent.searchPhrase = MOCK_SEARCH_PHRASE;
    mainComponent.sortBy = MOCK_SORT_BY;
    mainComponent.maxResults = MOCK_MAX_RESULTS;
    
    mainComponent.$onDestroy();

    //clear values
    mainComponent.wpPosts = null;
    mainComponent.pageDomain = null;
    mainComponent.searchPhrase = null;
    mainComponent.sortBy = null;
    mainComponent.maxResults = null;

    mainComponent.$onInit();
    
    //check values
    expect(postService.storage).toBeDefined();
    expect(mainComponent.wpPosts).toEqual(MOCK_POSTS);
    expect(mainComponent.pageDomain).toBe(MOCK_PAGE_DOMAIN);
    expect(mainComponent.searchPhrase).toBe(MOCK_SEARCH_PHRASE);
    expect(mainComponent.sortBy).toBe(MOCK_SORT_BY);
    expect(mainComponent.maxResults).toBe(MOCK_MAX_RESULTS);
  });

  it('should not search when form is invalid', function() {
    //simulate invalid form
    var fakeFormCtrl = { '$valid': false };

    mainComponent.searchPosts(fakeFormCtrl);

    //check default values
    expect(mainComponent.wpPosts).toEqual([]);
    expect(mainComponent.dataLoaded).toBeNull();
    expect(mainComponent.alert).toBeNull();
  });

  it('should show message after error response', function() {
    //simulate valid form
    var fakeFormCtrl = { '$valid': true };
    mainComponent.pageDomain = 'wrong_site';

    $httpBackend.expectGET(/https:\/\/public-api\.wordpress\.com\/rest\/v1\.1\/sites\/wrong_site\/posts\/.*/)
      .respond(404, MOCK_ERROR_RESPONSE_DATA);
    mainComponent.searchPosts(fakeFormCtrl);
    $httpBackend.flush();

    //check values
    expect(mainComponent.wpPosts).toEqual([]);
    expect(mainComponent.dataLoaded).toBeNull();
    expect(mainComponent.alert).toBe(MOCK_ERROR_RESPONSE_DATA.message);
  });

  it('should show message after empty response', function() {
    //simulate valid form
    var fakeFormCtrl = { '$valid': true };
    mainComponent.pageDomain = MOCK_PAGE_DOMAIN;

    $httpBackend.expectGET(/https:\/\/public-api\.wordpress\.com\/rest\/v1\.1\/sites\/some_site\/posts\/.*/)
      .respond(200, { posts: [] });
    mainComponent.searchPosts(fakeFormCtrl);
    $httpBackend.flush();

    //check values
    expect(mainComponent.wpPosts).toEqual([]);
    expect(mainComponent.dataLoaded).toBe(true);
    expect(mainComponent.alert).toBeNull();
  });

  it('should show posts after correct response', function() {
    //simulate valid form
    var fakeFormCtrl = { '$valid': true };
    mainComponent.pageDomain = MOCK_PAGE_DOMAIN;

    $httpBackend.expectGET(/https:\/\/public-api\.wordpress\.com\/rest\/v1\.1\/sites\/some_site\/posts\/.*/)
      .respond(200, { posts: MOCK_POSTS });
    mainComponent.searchPosts(fakeFormCtrl);
    $httpBackend.flush();

    //check values
    expect(mainComponent.wpPosts).toEqual(MOCK_POSTS);
    expect(mainComponent.dataLoaded).toBe(true);
    expect(mainComponent.alert).toBeNull();
  });

});
