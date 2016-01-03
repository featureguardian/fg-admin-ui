var fg = angular.module('featureguardian', [
    'ngRoute',
    'applicationControllers',
    'roleControllers',
    'roleServices',
    'entitlementControllers',
    'entitlementServices',
    'applicationServices',
    'userControllers',
    'userServices',
    'ui.bootstrap',
    'ngStorage',
    'authController',
    'ngLodash'
]);

fg.constant('$fgConfig', {apiBaseUrl: 'http://localhost', apiPort: ':1337'});

fg.config(['$routeProvider', '$localStorageProvider',
    function ($routeProvider, $localStorageProvider) {
        var hasToken = $localStorageProvider.get('fgToken');
        if (!hasToken) {
            $localStorageProvider.set('fgToken', {t: null, hasToken: false});
        }
        $routeProvider.when('/application', {
            templateUrl: 'partials/application/application.html',
            controller: 'ApplicationInfoCtrl'
        }).when('/role/:roleId', {
            templateUrl: 'partials/roles/role-detail.html',
            controller: 'RoleDetailCtrl'
        }).when('/roles', {
            templateUrl: 'partials/roles/index.html',
            controller: 'RoleListCtrl'
        }).when('/users', {
            templateUrl: 'partials/users/index.html',
            controller: 'UserListCtrl'
        }).when('/user/:userId', {
            templateUrl: 'partials/users/user-detail.html',
            controller: 'UserDetailCtrl'
        }).when('/entitlements', {
            templateUrl: 'partials/entitlements/index.html',
            controller: 'EntitlementListCtrl'
        }).when('/entitlement/:entitlementId', {
            templateUrl: 'partials/entitlements/entitlement-detail.html',
            controller: 'EntitlementDetailCtrl'
        }).when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        }).when('/logout', {
            template: '',
            controller: 'LogoutCtrl'
        }).otherwise({
            redirectTo: '/application'
        });
    }]);

fg.run(function ($rootScope, $location, $localStorage) {

    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        if (!$localStorage.fgToken.hasToken) {
            $location.path('/login');
        }

    });
});