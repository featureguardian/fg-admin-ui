var applicationControllers = angular.module('applicationControllers', []);

applicationControllers.controller('ApplicationInfoCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Application', 
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Application){

	$scope.application = Application.query();

	$scope.attrKey = '';
	$scope.attrValue = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.removeAttr = function(idx){

    	var attr_to_delete = $scope.application.customAttributes[idx];

    	var resource = $resource(url + '/customattribute/' + attr_to_delete.id, {}, {
	    	delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.delete({}, function(customattribute){
			//$scope.entitlement.customAttributes.push(customattribute);// = Entitlements.query();
			$scope.application.customAttributes.splice(idx, 1);
		});
    }

	$scope.createCustomAttr = function(){
		var resource = $resource(url + '/customattribute', {}, {
	    	post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
	    });
		resource.post({key: $scope.attrKey, value: $scope.attrValue, applicationId: $scope.application.id}, function(customattribute){
			$scope.attrKey = '';
			$scope.attrValue = '';
			$scope.application.customAttributes.push(customattribute);// = Entitlements.query();
		});
	}

}]);
 
