var roleServices = angular.module('roleServices', ['ngResource']);

roleServices.factory('Roles', ['$resource', '$location', '$interpolate', '$localStorage', '$fgConfig',
  function($resource, $location, $interpolate, $localStorage, $fgConfig){
  	var ca = $location.search().custom_attributes;
  	var params = {custom_attributes: $location.search().custom_attributes};
  	if(ca === true){
  		params = {};
  	}

      var url = '{{url}}{{port}}/role/';
      url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    return $resource(url + ':roleId', {}, {
      query: {method:'GET', params:params, isArray:true, headers:{ Authorization: $localStorage.fgToken.t }},
        get: {method:'GET', isArray:false, headers:{ Authorization: $localStorage.fgToken.t }}
    });
  }]); 