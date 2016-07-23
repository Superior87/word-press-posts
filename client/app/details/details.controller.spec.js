'use strict';

describe('Component: detailsComponent', function() {

  // load the controller's module
  beforeEach(module('wordPressPostsApp'));

  var scope;
  var detailsComponent;
  var $httpBackend;

  //Initialize mock data
  var MOCK_POST = {
    ID: 0,
    site_ID: 0,
    title: 'some title 0'
  };
  var MOCK_SITE = 'some_site';
  var MOCK_ERROR_RESPONSE_DATA = { "error":"unknown_blog","message":"Unknown blog" };

  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$httpBackend_, $http, $componentController, $rootScope) {
    $httpBackend = _$httpBackend_;
    
    scope = $rootScope.$new();
    detailsComponent = $componentController('postdetails', {
      $http: $http,
      $scope: scope
    });
    
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it('should show message after error response', function() {
    detailsComponent.site = MOCK_POST.site_ID;
    detailsComponent.postId = MOCK_POST.ID;

    $httpBackend.expectGET(/https:\/\/public-api\.wordpress\.com\/rest\/v1\.1\/sites\/0\/posts\/0.*/)
      .respond(404, MOCK_ERROR_RESPONSE_DATA);
    detailsComponent.$onInit();
    $httpBackend.flush();

    //check values
    expect(detailsComponent.wpPost).toEqual({});
    expect(detailsComponent.dataLoaded).toBeNull();
    expect(detailsComponent.alert).toBe(MOCK_ERROR_RESPONSE_DATA.message);
  });

  it('should show post content after correct response', function() {
    detailsComponent.site = MOCK_POST.site_ID;
    detailsComponent.postId = MOCK_POST.ID;

    $httpBackend.expectGET(/https:\/\/public-api\.wordpress\.com\/rest\/v1\.1\/sites\/0\/posts\/0.*/)
      .respond(200, MOCK_POST);
    detailsComponent.$onInit();
    $httpBackend.flush();

    //check values
    expect(detailsComponent.wpPost).toEqual(MOCK_POST);
    expect(detailsComponent.dataLoaded).toBe(true);
    expect(detailsComponent.alert).toBeNull();
  });

});
