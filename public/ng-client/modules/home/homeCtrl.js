ocApp.controller('homeCtrl', function($scope, Restangular, $location, $anchorScroll, $rootScope, $routeParams) {

	$scope.challenges = Restangular.all('dashboards').getList().$object;

	$scope.projects = Restangular.all('projects').getList().$object;
	
	$scope.userCanEdit = true;

	$scope.goToChallenges = function (){
	    $location.hash('challenge-container');
	    $anchorScroll();
	}

	$scope.canEdit = function(challengeId){
		if(!challengeId){
			var challengeId = "2";
		}
		$scope.userCanEdit = ($rootScope.user.admin_in.indexOf(challengeId) >= 0);
		return $scope.userCanEdit;

	};
});