var roleControllers = angular.module('roleControllers', []);

roleControllers.controller('RoleListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Roles', 
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Roles){

	$scope.roles = Roles.query();

	$scope.roleName = '';
	$scope.roleType = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

	$scope.createRole = function(){
		var resource = $resource(url + '/role', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({name: $scope.roleName, type: $scope.roleType}, function(role){
			$scope.roleName = '';
			$scope.roleType = '';
			$scope.roles = Roles.query();
		});
	}
}]);

roleControllers.controller('RoleDetailCtrl', ['$scope', '$routeParams', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Roles', 
	function($scope, $routeParams, $fgConfig, $interpolate, $resource, $localStorage, Roles){

	Roles.get({roleId: $routeParams.roleId}, function(role){
		$scope.role = role;
	});

	$scope.attrKey = '';
	$scope.attrValue = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.removeAttr = function(idx){

    	var attr_to_delete = $scope.role.customAttributes[idx];

    	var resource = $resource(url + '/customattribute/' + attr_to_delete.id, {}, {
	    	delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.delete({}, function(customattribute){
			//$scope.entitlement.customAttributes.push(customattribute);// = Entitlements.query();
			$scope.role.customAttributes.splice(idx, 1);
		});
    }

	$scope.createCustomAttr = function(){
		var resource = $resource(url + '/customattribute', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({key: $scope.attrKey, value: $scope.attrValue, roleId: $scope.role.id}, function(customattribute){
			$scope.attrKey = '';
			$scope.attrValue = '';
			$scope.role.customAttributes.push(customattribute);// = Entitlements.query();
		});
	}

}]);