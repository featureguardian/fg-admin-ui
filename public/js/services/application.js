var applicationServices = angular.module('applicationServices', ['ngResource']);

applicationServices.factory('Application', ['$resource', '$http', '$interpolate', '$localStorage', '$fgConfig',
  function($resource, $http, $interpolate, $localStorage, $fgConfig){

      var url = '{{url}}{{port}}/application';
      url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    return $resource(url, {}, {
      query: {method:'GET', isArray:false, headers:{ Authorization: $localStorage.fgToken.t }}
    });


  }]); 
