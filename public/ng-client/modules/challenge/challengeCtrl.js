ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular) {

	Restangular.one('dashboards', $routeParams.projectId).get().then(function(challenge) {
		$scope.challenge = challenge[0];
	});;

});