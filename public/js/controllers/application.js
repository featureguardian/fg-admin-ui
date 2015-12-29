var applicationControllers = angular.module('applicationControllers', []);

applicationControllers.controller('ApplicationInfoCtrl', ['$scope', 'Application', function($scope, Application){

	$scope.application = Application.query();

}]);
 
