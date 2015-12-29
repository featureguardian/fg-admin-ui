var roleServices = angular.module('roleServices', ['ngResource']);

roleServices.factory('Roles', ['$resource', '$location',
  function($resource, $location){
  	var ca = $location.search().custom_attributes;
  	var params = {custom_attributes: $location.search().custom_attributes};
  	if(ca === true){
  		params = {};
  	}
    return $resource('role/:roleId', {}, {
      query: {method:'GET', params:params, isArray:true}
    });
  }]); 