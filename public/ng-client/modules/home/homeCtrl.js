ocApp.controller('homeCtrl', function($scope,Restangular) {

	$scope.challenges = Restangular.all('dashboards').getList().$object;

	$scope.collections = Restangular.all('collections').getList().$object;

	$scope.projects = Restangular.all('projects').getList().$object;

});