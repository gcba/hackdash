ocApp.controller('homeCtrl', function($scope, Restangular, $location, $anchorScroll) {

	$scope.challenges = Restangular.all('dashboards').getList().$object;

	$scope.projects = Restangular.all('projects').getList().$object;
	
	$scope.goToChallenges = function (){
	    $location.hash('challenge-container');
	    $anchorScroll();
	};

});