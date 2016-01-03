var userControllers = angular.module('userControllers', []);

userControllers.controller('UserListCtrl', ['$scope', '$fgConfig', '$interpolate', '$resource', '$localStorage', 'Users', '$window', '$uibModal',
	function($scope, $fgConfig, $interpolate, $resource, $localStorage, Users, $window, $uibModal){

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
		resource.post({email: $scope.userEmail, type: $scope.userType, providerId: $scope.userProvider}, function(usr){
			$scope.userEmail = '';
			$scope.userType = '';
			$scope.userProvider = '';
			$scope.users = Users.query();
		});
	}

    $scope.openUser = function (idx) {

      var user = $scope.users[idx];

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'userModal.html',
        controller: 'UserModalInstanceCtrl',
        resolve: {
          user: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/user/' + user.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({email: o.email, type: o.type, providerId: o.providerId}, function(usr){
          user.type = o.type;
          user.email = o.email;
          user.providerId = o.providerId;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.removeUser = function(idx){

      var deleteUser = $window.confirm('Are you sure you want to delete this user?');

      if (deleteUser) {
        var user_to_delete = $scope.users[idx];

        var resource = $resource(url + '/user/' + user_to_delete.id, {}, {
          delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.delete({}, function(user){
          $scope.users.splice(idx, 1);
        });
      }
    }
}]);

userControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', '$resource', 'Users', 'Roles', '$interpolate', '$localStorage', '$fgConfig', '$uibModal',
	function($scope, $routeParams, $resource, Users, Roles, $interpolate, $localStorage, $fgConfig, $uibModal){

	var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

	Users.get({userId: $routeParams.userId}, function(user){
		$scope.user = user;
		$scope.getRolesNotIn();
		$scope.getEntitlementsNotIn();
	});

    $scope.openRestrictions = function(idx){

      var role = $scope.user.roles[idx];

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'roleRestrictionsModal.html',
        controller: 'RoleRestrictionsModalInstanceCtrl',
        size: 'lg',
        resolve: {
          user: function () {
            return $scope.user;
          },
          role: function(){
            return role;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/user/' + user.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({email: o.email, type: o.type, providerId: o.providerId}, function(usr){
          user.type = o.type;
          user.email = o.email;
          user.providerId = o.providerId;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    },

    $scope.getRestrictions = function(userId, roleId)
    {
      var count = 0;
      $scope.user.roleEntitlementRestrictions.forEach(function(restriction){
        if(restriction.roleId === roleId){
          count++;
        }
      });
      return count;
    },

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

    $scope.openUser = function () {

      var user = $scope.user;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'userModal.html',
        controller: 'UserModalInstanceCtrl',
        resolve: {
          user: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (o) {
        var resource = $resource(url + '/user/' + user.id, {}, {
          put: { method: 'PUT', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.put({email: o.email, type: o.type, providerId: o.providerId}, function(usr){
          user.type = o.type;
          user.email = o.email;
          user.providerId = o.providerId;
        });
      }, function () {
        //$log.info('Modal dismissed at: ' + new Date());
      });
    };

}]);

userControllers.controller('UserModalInstanceCtrl', function ($scope, $uibModalInstance, user) {

  $scope.user = user;
  $scope.userType = user.type;
  $scope.userProvider = user.providerId;
  $scope.userEmail = user.email;

  $scope.editUser = function () {
    $uibModalInstance.close({type:$scope.userType, email:$scope.userEmail, providerId:$scope.userProvider});
  };

  $scope.cancelUser = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

userControllers.controller('RoleRestrictionsModalInstanceCtrl',
  function ($scope, $uibModalInstance, $fgConfig, $interpolate, $resource, $localStorage, user, role, lodash) {

    $scope.user = user;

    var url = '{{url}}{{port}}';
    url = $interpolate(url)({url: $fgConfig.apiBaseUrl, port: $fgConfig.apiPort});

    //need to get role again to get entitlements
    var resource = $resource(url + '/role/:roleId', {}, {
      get: { method: 'GET', isArray: false, headers: { Authorization: $localStorage.fgToken.t }}
    });
    resource.get({roleId: role.id}, function(role){
      $scope.role = role;
    });

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.getChecked = function(entitlementId){
      var r = lodash.findWhere($scope.user.roleEntitlementRestrictions, {entitlementId: entitlementId, roleId: $scope.role.id});
      if(!r){
        return true;
      }
      return false;
    }

    $scope.stateChanged = function(entitlementId){

      var hasEntitlement = $scope.getChecked(entitlementId);
      var r = lodash.findWhere($scope.user.roleEntitlementRestrictions, {entitlementId: entitlementId, roleId: $scope.role.id});

      if(hasEntitlement){
        var resource = $resource(url + '/roleentitlementuserrestriction', {}, {
          post: { method: 'POST', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.post({userId: $scope.user.id, entitlementId: entitlementId, roleId: $scope.role.id}, function(restriction){
          $scope.user.roleEntitlementRestrictions.push(restriction);
        });
      }
      else{
        var resource = $resource(url + '/roleentitlementuserrestriction/:id', {}, {
          delete: { method: 'DELETE', headers: { Authorization: $localStorage.fgToken.t }}
        });
        resource.delete({id: r.id}, function(restriction){
          var idx = lodash.indexOf($scope.user.roleEntitlementRestrictions, restriction);
          lodash.remove($scope.user.roleEntitlementRestrictions, function(r){
            return r.id === restriction.id;
          });
        });
      }
    }



});