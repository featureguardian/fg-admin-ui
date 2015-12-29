var userControllers = angular.module('userControllers', []);

userControllers.controller('UserListCtrl', ['$scope', 'Users', function($scope, Users){
	$scope.users = Users.query();
}]);

userControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', '$resource', 'Users', 'Roles', function($scope, $routeParams, $resource, Users, Roles){

	Users.get({userId: $routeParams.userId}, function(user){
		$scope.user = user;
		$scope.getRolesNotIn();
		$scope.getEntitlementsNotIn();
	});

	$scope.getRolesNotIn = function(){
		//$scope.roles = Roles.query();
		//var role_to_add_div = angular.element( document.querySelector( '#roles-to-add' ) );
		var User = $resource('/user/rolesNotIn/:user_id');
		var user = User.query({user_id: $scope.user.id}, function(roles){
			$scope.roles = roles;
		});
	},

	$scope.addToRole = function(roleId, event) {
		var User = $resource('/user/assignToRole/:user_id/:role_id');
		var user = User.save({user_id: $scope.user.id, role_id: roleId}, function(usr) {
		  	$scope.user = usr;
		  	$scope.roles = $scope.getRolesNotIn();
		});
		event.stopPropagation();
	},

	$scope.removeFromRole = function(roleId, event){
		var resource = $resource('/user/removeFromRole/:user_id/:role_id');
		resource.save({user_id: $scope.user.id, role_id: roleId}, function(usr){
			$scope.user = usr;
		  	$scope.roles = $scope.getRolesNotIn();
		});
		event.stopPropagation();
	},

	$scope.giveEntitlement = function(entitlementId, event) {
		var User = $resource('/user/giveEntitlement/:user_id/:entitlement_id');
		var user = User.save({user_id: $scope.user.id, entitlement_id: entitlementId}, function(usr) {
		  	$scope.user = usr;
		  	$scope.entitlements = $scope.getEntitlementsNotIn();
		});
		event.stopPropagation();
	},

	$scope.removeEntitlement = function(entitlementId, event){
		var resource = $resource('/user/removeEntitlement/:user_id/:entitlement_id');
		resource.save({user_id: $scope.user.id, entitlement_id: entitlementId}, function(usr){
			$scope.user = usr;
		  	$scope.entitlements = $scope.getEntitlementsNotIn();
		});
		event.stopPropagation();
	},

	$scope.getEntitlementsNotIn = function(){
		var resource = $resource('/user/entitlementsNotIn/:user_id');
		resource.query({user_id: $scope.user.id}, function(entitlements){
			$scope.entitlements = entitlements;
		});
	}

}]);