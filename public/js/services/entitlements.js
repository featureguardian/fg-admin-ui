var entitlementServices = angular.module('entitlementServices', ['ngResource']);

entitlementServices.factory('Entitlements', ['$resource', '$location', '$interpolate', '$localStorage', '$fgConfig',
  function($resource, $location, $interpolate, $localStorage, $fgConfig){
  	var ca = $location.search().custom_attributes;
  	var params = {custom_attributes: $location.search().custom_attributes};
  	if(ca === true){
  		params = {};
  	}

      var url = '{{url}}{{port}}/entitlement/';
      url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    return $resource(url + ':entitlementId', {}, {
      query: {method:'GET', params:params, isArray:true, headers:{ Authorization: $localStorage.fgToken.t }},
        get: {method:'GET', isArray:false, headers:{ Authorization: $localStorage.fgToken.t }}
    });
  }]); 