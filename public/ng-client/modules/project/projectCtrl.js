ocApp.controller('projectCtrl', function($scope, $routeParams, Restangular, $rootScope, $location) {

	$scope.project = {};

	$scope.votes = "gola";

	$scope.viewInit = function(){
		if($routeParams.projectId){
			Restangular.one('projects', $routeParams.projectId).get()
				.then(function(project){
					$scope.project = project;
			  		$scope.challenge = Restangular.one('dashboards', project.challenge_id).get().$object;
				});
		}
	}

	$scope.vote = function(projectId){

		if($rootScope.user){
			Restangular.one('projects', projectId)
				.post('followers')
				.then(function(updatedProject){
					$scope.project = updatedProject;
				});
		} else {
			$location.path('/login');
		}

	}

});