/**
 * Created by adam on 12/28/15.
 */
var loginController = angular.module('loginController', []);

loginController.controller('LoginCtrl', function($scope, $http, $resource, $fgConfig, $interpolate, $localStorage, $location){
    var url = '{{url}}{{port}}/token';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    var req = {
        method: 'GET',
        url: url,
        headers: {

        },
        params: { appId: '567595e998bb2cd24ecf99aa' }
    }

    $http(req).then(function successCallback(response) {
        $localStorage.fgToken = { t: response.data.token, hasToken: true }
        $location.path('/application');
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

});