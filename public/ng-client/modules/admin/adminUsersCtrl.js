ocApp.controller('adminUsersCtrl', function($rootScope, $scope, Restangular, $location) {

	console.log($rootScope.user.role);

	if($rootScope.user.role == 'superadmin'){
		$scope.users = Restangular.all('users').getList().$object;
	} else {
		$location.path('/home');
	}

});