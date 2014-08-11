ocApp.controller('viewProfileCtrl', function($scope, $routeParams, Restangular) {

	$scope.user = Restangular.one('profiles', $routeParams.profileId).get().$object;

});