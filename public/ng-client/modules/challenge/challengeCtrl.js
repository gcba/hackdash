ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular, $location, $rootScope, isEdit) {

	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	$scope.userCanEdit = ($rootScope.user.admin_in.indexOf($routeParams.challengeId) >= 0);


	//View & Edit: load challenge
	if($routeParams.challengeId){
		if( isEdit && !$scope.userCanEdit ){
			$location.path('/');
		}
		
		$scope.projectOptions = Restangular.allUrl('projects/schema').getList().$object;

		Restangular.one('dashboards', $routeParams.challengeId).get()
			.then(function(challenge){
		  		$scope.challenge = challenge;
		  		$scope.challenge.id = challenge._id;
			});
	}

	$scope.add = function(challenge){
		Restangular.all('dashboards')
			.post(challenge)
			.then(function(e){
				$location.path('/challenge/'+e._id+'/edit');
			});
	};

	$scope.update = function(challenge){
		$scope.challenge.put().then(function(e){
			//$location.path('/challenge/'+e._id);
		});
	};

});