var userServices = angular.module('userServices', ['ngResource']);

userServices.factory('Users', ['$resource', '$location', '$interpolate', '$localStorage', '$fgConfig',
  function($resource, $location, $interpolate, $localStorage, $fgConfig){
  	var ca = $location.search().custom_attributes;
  	var params = {custom_attributes: $location.search().custom_attributes};
  	if(ca === true){
  		params = {};
  	}

      var url = '{{url}}{{port}}/user/';
      url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    return $resource(url + ':userId', {}, {
      query: {method:'GET', params:params, isArray:true, headers:{'Authorization':'Bearer ' + $localStorage.fgToken.t }},
        get: {method:'GET', isArray:false, headers:{'Authorization':'Bearer ' + $localStorage.fgToken.t }}
    });
  }]); 