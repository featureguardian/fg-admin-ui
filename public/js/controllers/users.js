var userControllers = angular.module('userControllers', []);

userControllers.controller('UserListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Users', 
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Users){

	$scope.users = Users.query();

	$scope.userEmail = '';
	$scope.userType = '';
	$scope.userProvider = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

	$scope.createUser = function(){
		var resource = $resource(url + '/user', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({email: $scope.userEmail, type: $scope.userType, providerId: $scope.userProvider}, function(role){
			$scope.userEmail = '';
			$scope.userType = '';
			$scope.userProvider = '';
			$scope.users = Users.query();
		});
	}
}]);

userControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', '$resource', 'Users', 'Roles', '$interpolate', '$localStorage', '$fgConfig', 
	function($scope, $routeParams, $resource, Users, Roles, $interpolate, $localStorage, $fgConfig){

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

	Users.get({userId: $routeParams.userId}, function(user){
		$scope.user = user;
		$scope.getRolesNotIn();
		$scope.getEntitlementsNotIn();
	});

	$scope.getRolesNotIn = function(){
		//$scope.roles = Roles.query();
		//var role_to_add_div = angular.element( document.querySelector( '#roles-to-add' ) );
		var User = $resource(url + '/user/rolesNotIn/:userId', {}, {
	    	get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
	    });
		var user = User.get({userId: $scope.user.id}, function(roles){
			$scope.roles = roles;
		});
	},

	$scope.addToRole = function(roleId, event) {
		var User = $resource(url + '/user/assignToRole/:userId/:roleId', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		var user = User.post({userId: $scope.user.id, roleId: roleId}, function(usr) {
		  	$scope.user = usr;
		  	$scope.roles = $scope.getRolesNotIn();
		});
		event.stopPropagation();
	},

	$scope.removeFromRole = function(roleId, event){
		var resource = $resource(url + '/user/removeFromRole/:userId/:roleId', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({userId: $scope.user.id, roleId: roleId}, function(usr){
			$scope.user = usr;
		  	$scope.roles = $scope.getRolesNotIn();
		});
		event.stopPropagation();
	},

	$scope.giveEntitlement = function(entitlementId, event) {
		var User = $resource(url + '/user/giveEntitlement/:userId/:entitlementId', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		var user = User.post({userId: $scope.user.id, entitlementId: entitlementId}, function(usr) {
		  	$scope.user = usr;
		  	$scope.entitlements = $scope.getEntitlementsNotIn();
		});
		event.stopPropagation();
	},

	$scope.removeEntitlement = function(entitlementId, event){
		var resource = $resource(url + '/user/removeEntitlement/:userId/:entitlementId', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({userId: $scope.user.id, entitlementId: entitlementId}, function(usr){
			$scope.user = usr;
		  	$scope.entitlements = $scope.getEntitlementsNotIn();
		});
		event.stopPropagation();
	},

	$scope.getEntitlementsNotIn = function(){
		var resource = $resource(url + '/user/entitlementsNotIn/:userId', {}, {
	    	get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.get({userId: $scope.user.id}, function(entitlements){
			$scope.entitlements = entitlements;
		});
	}

	$scope.attrKey = '';
	$scope.attrValue = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.removeAttr = function(idx){

    	var attr_to_delete = $scope.user.customAttributes[idx];

    	var resource = $resource(url + '/customattribute/' + attr_to_delete.id, {}, {
	    	delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.delete({}, function(customattribute){
			//$scope.entitlement.customAttributes.push(customattribute);// = Entitlements.query();
			$scope.user.customAttributes.splice(idx, 1);
		});
    }

	$scope.createCustomAttr = function(){
		var resource = $resource(url + '/customattribute', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({key: $scope.attrKey, value: $scope.attrValue, userId: $scope.user.id}, function(customattribute){
			$scope.attrKey = '';
			$scope.attrValue = '';
			$scope.user.customAttributes.push(customattribute);// = Entitlements.query();
		});
	}

}]);