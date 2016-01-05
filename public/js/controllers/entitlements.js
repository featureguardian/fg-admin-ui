var entitlementControllers = angular.module('entitlementControllers', []);

entitlementControllers.controller('EntitlementListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Entitlements', '$window', '$uibModal',
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Entitlements, $window, $uibModal){

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
			$scope.entitlements.push(entitlement);
		});
	}

    $scope.openEntitlement = function (idx) {

      var entitlement = $scope.entitlements[idx];

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entitlementModal.html',
        controller: 'EntitlementModalInstanceCtrl',
        resolve: {
          entitlement: function () {
            return entitlement;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/entitlement/' + entitlement.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({type: o.type, name: o.name}, function(ent){
          entitlement.name = o.name;
          entitlement.type = o.type;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.removeEntitlement = function(idx){

      var deleteEntitlement = $window.confirm('Are you sure you want to delete this entitlement?');

      if(deleteEntitlement){
        var entitlement_to_delete = $scope.entitlements[idx];

        var resource = $resource(url + '/entitlement/' + entitlement_to_delete.id, {}, {
          delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.delete({}, function(entitlement){
          $scope.entitlements.splice(idx, 1);
        });
      }
    }
}]);

entitlementControllers.controller('EntitlementDetailCtrl', ['$scope', '$routeParams', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Entitlements', '$uibModal',
	function($scope, $routeParams, $fgConfig, $interpolate, $resource, $localStorage, Entitlements, $uibModal){

	Entitlements.get({entitlementId: $routeParams.entitlementId}, function(entitlement){
		$scope.entitlement = entitlement;
    $scope.getRolesNotInEntitlement();
    $scope.getUsersNotInEntitlement();
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

    $scope.openEntitlement = function () {

      var entitlement = $scope.entitlement;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'entitlementModal.html',
        controller: 'EntitlementModalInstanceCtrl',
        resolve: {
          entitlement: function () {
            return entitlement;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/entitlement/' + entitlement.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({type: o.type, name: o.name}, function(ent){
          entitlement.name = o.name;
          entitlement.type = o.type;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.removeRoleFromEntitlement = function(idx){

      var role = $scope.entitlement.roles[idx];

      var resource = $resource(url + '/role/removeFromEntitlement/:entitlementId/:roleId', {}, {
        post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
      });
      resource.post({entitlementId: $scope.entitlement.id, roleId: role.id}, function(role){
        $scope.entitlement.roles.splice(idx, 1);
        $scope.roles.push(role);
      });
    },

      $scope.getRolesNotInEntitlement = function(){

        var resource = $resource(url + '/role/rolesNotInEntitlement/:entitlementId', {}, {
          get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.get({entitlementId: $scope.entitlement.id}, function(roles){
          $scope.roles = roles;
        });
      },

      $scope.addRoleToEntitlement = function(idx){

        var role = $scope.roles[idx];

        var resource = $resource(url + '/role/addToEntitlement/:entitlementId/:roleId', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({entitlementId: $scope.entitlement.id, roleId: role.id}, function(role){
          $scope.entitlement.roles.push(role);
          $scope.roles.splice(idx, 1);
        });
      },

      $scope.getUsersNotInEntitlement = function(){

        var resource = $resource(url + '/entitlement/usersNotInEntitlement/:entitlementId', {}, {
          get: { method: 'GET', isArray: true, headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.get({entitlementId: $scope.entitlement.id}, function(users){
          $scope.users = users;
        });
      },

      $scope.addUserToEntitlement = function(idx) {

        var user = $scope.users[idx];

        var resource = $resource(url + '/user/giveEntitlement/:userId/:entitlementId', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({userId: user.id, entitlementId: $scope.entitlement.id}, function(usr) {
          $scope.users.splice(idx, 1);
          $scope.entitlement.users.push(usr);
        });

      },

      $scope.removeUserFromEntitlement = function(idx){

        var user = $scope.entitlement.users[idx];

        var resource = $resource(url + '/user/removeEntitlement/:userId/:entitlementId', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({userId: user.id, entitlementId: $scope.entitlement.id}, function(usr){
          $scope.entitlement.users.splice(idx, 1);
          $scope.users.push(usr);
        });

      }


}]);

entitlementControllers.controller('EntitlementModalInstanceCtrl', function ($scope, $uibModalInstance, entitlement) {

  $scope.entitlement = entitlement;
  $scope.entitlementType = entitlement.type;
  $scope.entitlementName = entitlement.name;

  $scope.editEntitlement = function () {
    $uibModalInstance.close({type:$scope.entitlementType, name: $scope.entitlementName});
  };

  $scope.cancelEntitlement = function () {
    $uibModalInstance.dismiss('cancel');
  };
});