ocApp.controller('projectCtrl', function($scope, $routeParams, Restangular, $rootScope, $location) {

	$scope.project = {};

	if($routeParams.projectId){
		Restangular.one('projects', $routeParams.projectId).get()
			.then(function(project){
				$scope.project = project;
		  		$scope.challenge = Restangular.one('dashboards', project.challenge_id).get().$object;
			});
	}

});