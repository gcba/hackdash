ocApp.controller('adminChallengesCtrl', function($rootScope, $routeParams, $scope, Restangular, $location) {


	if($rootScope.user.role == 'user'){
		$location.path('/home');
	}

	$scope.challenges = Restangular.all('admin_dashboards').getList().$object;

	$scope.removeChallenge = function(challenge){
		if(confirm("¿ Seguro que desea eliminar el concurso "+challenge.title + " ?")){
			challenge.remove();
			$scope.challenges = Restangular.all('admin_dashboards').getList().$object;
		}
	}

});