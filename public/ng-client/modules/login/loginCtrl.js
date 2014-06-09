ocApp.controller('loginCtrl', function($scope,Restangular,$location,$rootScope) {

	if($rootScope.user){
		$location.path('/');
	}

});