/**
 * Created by adam on 12/28/15.
 */
var authController = angular.module('authController', []);

authController.controller('LoginCtrl', function ($scope, $http, $resource, $fgConfig, $interpolate, $localStorage, $location) {
    var url = '{{url}}{{port}}/token/findByAppEmail';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.appId = '';
    $scope.email = '';
    $scope.loginPage = true;

    $scope.login = function () {
        var req = {
            method: 'GET',
            url: url,
            headers: {},
            params: {appId: $scope.appId, email: $scope.email}
        }
        $http(req).then(function successCallback(response) {
            $localStorage.fgToken = {t: response.data.token, hasToken: true}
            $location.path('/application');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

});

authController.controller('LogoutCtrl', function ($scope, $http, $fgConfig, $interpolate, $localStorage, $location) {
    $localStorage.fgToken = {t: null, hasToken: false};
    $location.path('/login');
});