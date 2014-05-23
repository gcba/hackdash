ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular, $location, $rootScope, action) {

	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	if($rootScope.user){
		$scope.userCanEdit = ($rootScope.user.admin_in.indexOf($routeParams.challengeId) >= 0);
	}

	//Validate user and roles
	switch(action){
		case 'add':
			if(!$rootScope.user){
				$location.path('/home');
			}
			break;
		case 'edit':
			if(!$rootScope.user || !$scope.userCanEdit){
				$location.path('/challenge/'+$routeParams.challengeId);
			}
			$scope.projectOptions = Restangular.allUrl('projects/schema').getList().$object;
			break;
		case 'view':
			$scope.project = {}; //NEW
			$scope.projects = Restangular.one('dashboards', $routeParams.challengeId).getList('projects').$object;
			break;
	}

	//View & Edit: load challenge
	if($routeParams.challengeId){
		Restangular.one('dashboards', $routeParams.challengeId).get()
			.then(function(challenge){
		  		$scope.challenge = challenge;
			});
	}

	$scope.addProject = function(project){
		project.challenge_id = $scope.challenge._id;

		Restangular.all("projects")
			.post(project)
			.then(function(e){
				$location.path('/submit/'+e._id);
			}, function(response) {
				console.log("Error with status code", response.status);
			});

	};

	$scope.add = function(challenge){
		Restangular.all('dashboards')
			.post(challenge)
			.then(function(e){
				$rootScope.refreshUser(function(){

					$location.path('/challenge/'+e._id+'/edit');
				});
			});
	};

	$scope.update = function(challenge){
		challenge.put().then(function(e){
			console.log('pala');
			$location.path('/challenge/'+e._id);
		});
	};

});