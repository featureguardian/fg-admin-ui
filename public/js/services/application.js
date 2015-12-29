var applicationServices = angular.module('applicationServices', ['ngResource']);

applicationServices.factory('Application', ['$resource',
  function($resource){
    return $resource('application', {}, {
      query: {method:'GET', isArray:false}
    });
  }]); 
