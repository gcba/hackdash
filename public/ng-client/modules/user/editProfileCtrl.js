ocApp.controller('editProfileCtrl', function($scope, $rootScope, $routeParams, Restangular, $location) {

	if($rootScope.user){
		$scope.user = Restangular.one('profiles', $rootScope.user._id).get().$object;
	} else {
		$location.path('/home');
	}

	$scope.update = function(user) {
		var data = {
			name: user.name,
			bio: user.bio,
			email: user.email
		}
		Restangular.one('profiles', $rootScope.user._id)
			.customPUT(data)
			.then(function(e){
				angular.extend($rootScope.user,data);
				$location.path('/profile/'+$rootScope.user._id);
			});
    };

});