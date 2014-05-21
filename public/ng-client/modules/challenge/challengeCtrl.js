ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular) {

	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	if($routeParams.projectId){
		Restangular.one('dashboards', $routeParams.projectId).get().then(function(challenge) {
			$scope.challenge = challenge[0];
		});
	}

	$scope.loadbase = function(challenge){
		$scope.page_contents_type = $rootScope.page_contents_type;
	};

	$scope.add = function(challenge){
		console.log(challenge);
	};

});