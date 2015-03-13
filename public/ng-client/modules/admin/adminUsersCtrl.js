ocApp.controller('adminUsersCtrl', function($rootScope, $routeParams, $scope, Restangular, $location) {

	if(!$rootScope.user.role == 'superadmin'){
		$location.path('/home');
	}

	//View & Edit: load user
	if($routeParams.userId){
		Restangular.one('admin_users', $routeParams.userId).get()
		.then(function(user){
			$scope.user = user;	
			Restangular.all('dashboards').getList()
				.then(function(challenges){
					$scope.challenges = challenges.filter(function(o){
						return user.admin_in.indexOf(o._id)<0;
					});
				});
		});
		$scope.selectedChallenge;
	} else {
		$scope.users = Restangular.all('users').getList().$object;
	}

	$scope.addChallengeToAdmin = function(){
		if($scope.selectedChallenge){
			var ch = $scope.selectedChallenge;
			$scope.user.admin_in.push(ch._id);
			$scope.user.dashboards.push(ch);
			$scope.challenges = $scope.challenges.filter(function(o){
							return o!=ch;
						});
			$scope.selectedChallenge = '';
		}
	}

	$scope.removeChallengeToAdmin = function(challenge){
		var ch = challenge;
		$scope.challenges.push(ch);
		$scope.user.admin_in = $scope.user.admin_in.filter(function(o){
						return o!=ch._id;
					});
		$scope.user.dashboards = $scope.user.dashboards.filter(function(o){
						return o!=ch;
					});
		$scope.selectedChallenge = '';
	}

	$scope.update = function(user) {
		$scope.user.admin_in = user.admin_in;
		$scope.user.role = user.role;
		$scope.user.bio = user.bio;

		$scope.user.put().then(function(){
			$location.path('/admin/users');
		});

    };

});