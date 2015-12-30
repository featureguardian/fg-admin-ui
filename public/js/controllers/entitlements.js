var entitlementControllers = angular.module('entitlementControllers', []);

entitlementControllers.controller('EntitlementListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Entitlements', 
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Entitlements){

	$scope.entitlements = Entitlements.query();

	$scope.entitlementName = '';
	$scope.entitlementType = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

	$scope.createEntitlement = function(){
		var resource = $resource(url + '/entitlement', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({name: $scope.entitlementName, type: $scope.entitlementType}, function(entitlement){
			$scope.entitlementName = '';
			$scope.entitlementType = '';
			$scope.entitlements = Entitlements.query();
		});
	}
}]);

entitlementControllers.controller('EntitlementDetailCtrl', ['$scope', '$routeParams', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Entitlements', 
	function($scope, $routeParams, $fgConfig, $interpolate, $resource, $localStorage, Entitlements){

	Entitlements.get({entitlementId: $routeParams.entitlementId}, function(entitlement){
		$scope.entitlement = entitlement;
	});

	$scope.attrKey = '';
	$scope.attrValue = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.removeAttr = function(idx){

    	var attr_to_delete = $scope.entitlement.customAttributes[idx];

    	var resource = $resource(url + '/customattribute/' + attr_to_delete.id, {}, {
	    	delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.delete({}, function(customattribute){
			//$scope.entitlement.customAttributes.push(customattribute);// = Entitlements.query();
			$scope.entitlement.customAttributes.splice(idx, 1);
		});
    }

	$scope.createCustomAttr = function(){
		var resource = $resource(url + '/customattribute', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({key: $scope.attrKey, value: $scope.attrValue, entitlementId: $scope.entitlement.id}, function(customattribute){
			$scope.attrKey = '';
			$scope.attrValue = '';
			$scope.entitlement.customAttributes.push(customattribute);// = Entitlements.query();
		});
	}

}]);