ocApp.controller('projectCtrl', function($scope, $routeParams, Restangular) {

	$scope.project = {};

	Restangular.one('dashboards', $routeParams.projectId).get().then(function(challenge) {
		$scope.challenge = challenge[0];
	});

	$scope.add = function(project) {

		project.tags = project.tags.split(',');
		project.challenge_id = $scope.challenge._id;

		Restangular.all("projects")
			.post(project)
			.then(function(e){
				console.log(e);
				//$location.path('/profile/'+$rootScope.user._id);
			});

		//TODO hacer load de img

    };

});