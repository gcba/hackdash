ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular, $location, $rootScope) {

	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	//Inits
	$scope.editProjectsInit = function(){
		$scope.checkCanEdit();
		if(!$rootScope.user || !$scope.userCanEdit){
			$location.path('/challenge/'+$routeParams.challengeId);
		}
		$scope.loadChallenge();
	};

	$scope.checkCanEdit = function(){
		if($rootScope.user){
			$scope.userCanEdit = ($rootScope.user.admin_in.indexOf($routeParams.challengeId) >= 0);
		}
	};

	$scope.editInit = function(){
		$scope.checkCanEdit();
		if(!$rootScope.user || !$scope.userCanEdit){
			$location.path('/challenge/'+$routeParams.challengeId);
		}
		$scope.loadChallenge();
	};

	$scope.addInit = function(){
		if(!$rootScope.user){
			$location.path('/home');
		}
	};

	$scope.viewInit = function(){
		$scope.checkCanEdit();
		$scope.loadChallenge();
		$scope.project = {}; //NEW
	};

	//Common
	$scope.loadChallenge = function(){
		if($routeParams.challengeId){
			Restangular.one('dashboards', $routeParams.challengeId).get()
				.then(function(challenge){
			  		$scope.challenge = challenge;
			  		$scope.preprocessStages();
				});
			$scope.projects = Restangular.one('dashboards', $routeParams.challengeId).getList('projects').$object;
			$scope.admins = Restangular.one('dashboards', $routeParams.challengeId).getList('admins').$object;
		}
	};

	$scope.preprocessStages = function(){
		angular.forEach($scope.challenge.stages, function(s,k){
			s.permissionOptions = $rootScope.permissions;
			s.permissionOptions = s.permissionOptions.filter(function(e){
				return s.permissions.indexOf(e)<0;
 			});
		});
	};

	//Interaction
	$scope.addStage = function(){
		$scope.challenge.stages.push({permissions:[], permissionOptions:$rootScope.permissions});
	};

	$scope.addPermission = function(stage){
		if(stage.selectedPermission){
			stage.permissions.push(stage.selectedPermission);
			stage.selectedPermission = '';
			stage.permissionOptions.splice(stage.permissionOptions.indexOf(stage.selectedPermission)+1,1);
		}
	};

	$scope.removePermission = function(stage,index){
		stage.permissionOptions.push(stage.permissions[index]);
		stage.permissions.splice(index, 1);
	};

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

	//Submits
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
		angular.forEach(challenge.stages, function(s,k){
			delete s.permissionOptions;
		});
		challenge.put().then(function(e){
			$location.path('/challenge/'+e._id);
		});
	};

});