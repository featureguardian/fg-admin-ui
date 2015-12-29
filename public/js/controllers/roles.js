var roleControllers = angular.module('roleControllers', []);

roleControllers.controller('RoleListCtrl', ['$scope', 'Roles', function($scope, Roles){
	$scope.roles = Roles.query();
}]);

roleControllers.controller('RoleDetailCtrl', ['$scope', '$routeParams', 'Roles', function($scope, $routeParams, Roles){

	Roles.get({roleId: $routeParams.roleId}, function(role){
		$scope.role = role;
	});

}]);