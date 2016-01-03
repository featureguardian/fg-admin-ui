var roleControllers = angular.module('roleControllers', []);

roleControllers.controller('RoleListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Roles', '$window', '$uibModal',
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Roles, $window, $uibModal){

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
			$scope.roles.push(role);
		});
	}

    $scope.openRole = function (idx) {

      var role = $scope.roles[idx];

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'roleModal.html',
        controller: 'RoleModalInstanceCtrl',
        resolve: {
          role: function () {
            return role;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/role/' + role.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({type: o.type, name: o.name}, function(rol){
          role.name = o.name;
          role.type = o.type;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

		$scope.removeRole = function(idx){

      var deleteRole = $window.confirm('Are you sure you want to delete this role?');

      if(deleteRole){
        var role_to_delete = $scope.roles[idx];

        var resource = $resource(url + '/role/' + role_to_delete.id, {}, {
          delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.delete({}, function(role){
          $scope.roles.splice(idx, 1);
        });
      }
		}
}]);

roleControllers.controller('RoleDetailCtrl', ['$scope', '$routeParams', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Roles', '$uibModal',
	function($scope, $routeParams, $fgConfig, $interpolate, $resource, $localStorage, Roles, $uibModal){

	Roles.get({roleId: $routeParams.roleId}, function(role){
		$scope.role = role;
    $scope.getEntitlementsNotInRole();
    $scope.getUsersNotInRole();
	});

	$scope.attrKey = '';
	$scope.attrValue = '';

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    $scope.getEntitlementsNotInRole = function(){
      var resource = $resource(url + '/entitlement/entitlementsNotInRole/:roleId', {}, {
        get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
      });
      resource.get({roleId: $scope.role.id}, function(entitlements){
        $scope.entitlements = entitlements;
      });
    }

    $scope.addEntitlementToRole = function(idx){

      var entitlement = $scope.entitlements[idx];

      var resource = $resource(url + '/entitlement/assignToRole/:roleId/:entitlementId', {}, {
        post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
      });
      resource.post({roleId: $scope.role.id, entitlementId: entitlement.id}, function(entitlement){
        $scope.role.entitlements.push(entitlement);
        $scope.entitlements.splice(idx, 1);
      });
    }

    $scope.removeEntitlementFromRole = function(idx){

      var entitlement = $scope.role.entitlements[idx];

      var resource = $resource(url + '/entitlement/removeFromRole/:roleId/:entitlementId', {}, {
        post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
      });
      resource.post({roleId: $scope.role.id, entitlementId: entitlement.id}, function(ent){
        $scope.role.entitlements.splice(idx, 1);
        $scope.entitlements.push(ent);
      });
    },

      $scope.addUserToRole = function(idx) {

        var user = $scope.users[idx];

        var resource = $resource(url + '/user/assignToRole/:userId/:roleId', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({userId: user.id, roleId: $scope.role.id}, function(usr) {
          $scope.users.splice(idx, 1);
          $scope.role.users.push(usr);
        });
        event.stopPropagation();
      },

      $scope.removeUserFromRole = function(idx){

        var user = $scope.role.users[idx];

        var resource = $resource(url + '/user/removeFromRole/:userId/:roleId', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({userId: user.id, roleId: $scope.role.id}, function(usr){
          $scope.role.users.splice(idx, 1);
          $scope.users.push(usr);
        });
        event.stopPropagation();
      },

      $scope.getUsersNotInRole = function(){

        var resource = $resource(url + '/user/notInRole/:roleId', {}, {
          get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.get({roleId: $scope.role.id}, function(users){
          $scope.users = users;
        });
      },

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

    $scope.openRole = function (idx) {

      var role = $scope.role;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'roleModal.html',
        controller: 'RoleModalInstanceCtrl',
        resolve: {
          role: function () {
            return role;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/role/' + role.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({type: o.type, name: o.name}, function(rol){
          role.name = o.name;
          role.type = o.type;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

}]);

roleControllers.controller('RoleModalInstanceCtrl', function ($scope, $uibModalInstance, role) {

  $scope.role = role;
  $scope.roleType = role.type;
  $scope.roleName = role.name;

  $scope.editRole = function () {
    $uibModalInstance.close({type:$scope.roleType, name: $scope.roleName});
  };

  $scope.cancelRole = function () {
    $uibModalInstance.dismiss('cancel');
  };
});