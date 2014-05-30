ocApp.controller('adminChallengesCtrl', function($rootScope, $routeParams, $scope, Restangular, $location) {


	if($rootScope.user.role == 'user'){
		$location.path('/home');
	}

	$scope.challenges = Restangular.all('admin_dashboards').getList().$object;

});