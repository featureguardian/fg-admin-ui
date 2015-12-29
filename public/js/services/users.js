var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('Users', ['$resource', '$location',
  function($resource, $location){
  	var ca = $location.search().custom_attributes;
  	var params = {custom_attributes: $location.search().custom_attributes};
  	if(ca === true){
  		params = {};
  	}
    return $resource('user/:userId', {}, {
      query: {method:'GET', params:params, isArray:true}
    });
  }]); 