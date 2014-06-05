ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular, $location, $rootScope) {

	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	$scope.fieldOrders = [1,2,3,4,5,6,7,8,9];

	//Inits
	$scope.editProjectsInit = function(){
		$scope.checkCanEdit();
		if(!$rootScope.user || !$scope.userCanEdit){
			$location.path('/challenge/'+$routeParams.challengeId);
		}
		$scope.loadChallenge(false);
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
		$scope.projectOptionsAll = Restangular.allUrl('projects/schema').getList().$object;
		$scope.loadChallenge(true);
	};

	$scope.addInit = function(){
		if(!$rootScope.user){
			$location.path('/home');
		}
	};

	$scope.viewInit = function(){
		$scope.checkCanEdit();
		$scope.loadChallenge(false);
		$scope.project = {}; //NEW
	};

	//Common
	$scope.loadChallenge = function(isEdit){
		if($routeParams.challengeId){
			Restangular.one('dashboards', $routeParams.challengeId).get()
				.then(function(challenge){
			  		$scope.challenge = challenge;
			  		if(isEdit){
			  			$scope.preprocessCollections();
			  		}
				});
			$scope.projects = Restangular.one('dashboards', $routeParams.challengeId).getList('projects').$object;
			$scope.admins = Restangular.one('dashboards', $routeParams.challengeId).getList('admins').$object;
		}
	};

	$scope.preprocessCollections = function(){
		
		//permissions
		angular.forEach($scope.challenge.stages, function(s,k){
			s.permissionOptions = $rootScope.permissions;
			s.permissionOptions = s.permissionOptions.filter(function(e){
				return s.permissions.indexOf(e)<0;
 			});
		});

		$scope.projectOptions = $scope.projectOptionsAll;

		angular.forEach($scope.challenge.submit_fields, function(s,k){
			$scope.projectOptions.splice($scope.projectOptions.indexOf(s.type),1);
		});

	};

	//Interaction
	$scope.addStage = function(){
		$scope.challenge.stages.push({permissions:[], permissionOptions:$rootScope.permissions});
	};

	$scope.addPermission = function(stage){
		if(stage.selectedPermission){
			stage.permissions.push(stage.selectedPermission);
			stage.permissionOptions.splice(stage.permissionOptions.indexOf(stage.selectedPermission),1);
			stage.selectedPermission = '';
		}
	};

	$scope.addSubmitField = function(submitField){
		console.log(submitField);
		if(submitField.type && submitField.label && submitField.help && submitField.order){
			$scope.challenge.submit_fields.push({type:submitField.type,help:submitField.help,label:submitField.label,order:submitField.order});
			$scope.projectOptions.splice($scope.projectOptions.indexOf(submitField.type),1);
			submitField.type = '';
			submitField.help = '';
			submitField.label = '';
			submitField.order = '';
		}
	};

	$scope.removeSubmitField = function(index){
		$scope.challenge.submit_fields[index];
		$scope.projectOptions.push($scope.challenge.submit_fields[index].type);
		$scope.challenge.submit_fields.splice(index, 1);
	};

	$scope.removePermission = function(stage,index){
		stage.permissionOptions.push(stage.permissions[index]);
		stage.permissions.splice(index, 1);
	};

	$scope.addProject = function(project){

		$('#participate').modal('hide');

		project.challenge_id = $scope.challenge._id;

		Restangular.all("projects")
			.post(project)
			.then(function(e){
				$location.path('/submit/'+e._id);
			}, function(response) {
				console.log("Error with status code", response.status);
			});

	};

	$scope.openParticipatePopup = function(id){
		$('#participate').modal('show');
	};

	$scope.openProjectPopup = function(id){
		$('#project-'+id).modal('show');
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

	$scope.updateSubmit = function(submit){
		submit.put().then(function(e){
			$('#project-'+submit._id).modal('hide');
		});
	};

	$scope.cancelSubmit = function(id){
		$('#project-'+id).modal('hide');
		$scope.editProjectsInit();
	};

});