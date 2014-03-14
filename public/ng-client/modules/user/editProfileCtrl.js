ocApp.controller('editProfileCtrl', function($scope, $rootScope, $routeParams, Restangular, $location) {

	if($rootScope.user){
		$scope.userObj = Restangular.one('profiles', $rootScope.user._id);
		$scope.user = $scope.userObj.get().$object;
	} else {
		$location.path('/home');
	}

	$scope.update = function(user) {
		debugger;
      $rootScope.user = user.put();
    };

});