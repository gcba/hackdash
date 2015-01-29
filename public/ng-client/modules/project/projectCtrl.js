ocApp.controller('projectCtrl', function($scope, $routeParams, Restangular, $rootScope, $location, $window) {
	$scope.project = {};
	$scope.votes = "gola";
	$scope.location = $location;
	$scope.current_location = $location.absUrl();
	$scope.location_img = $location.protocol() + "://" + $location.host();
	
	$scope.currentPage = 1;
	$scope.numPerPage = 6;

	$scope.viewInit = function(){
		if($routeParams.projectId){
			Restangular.one('projects', $routeParams.projectId).get()
			.then(function(project){
				$scope.project = project;
		  		$scope.challenge = Restangular.one('dashboards', project.challenge_id).get().$object;
			});
		}
	}

	//vote
	$scope.vote = function(projectId){
		console.log("projectId: "+projectId);
		if($rootScope.user){
			Restangular.one('projects', projectId)
				.post('followers')
				.then(function(updatedProject){
					var projectIndex = _.findIndex($scope.$parent.projects, {_id:projectId});
					$scope.$parent.projects[projectIndex].followers = updatedProject.followers;
					$('.bs-'+projectId+'-modal-lg').modal('show');
				});
		} else {
			$window.location.href = '/auth/openid/';
		}
	}

	$scope.voteProject = function(project){
		if($rootScope.user){
			Restangular.one('projects', project._id)
			.post('followers')
			.then(function(updatedProject){
				project.followers = updatedProject.followers;
			});
		} else {
			$window.location.href = '/auth/openid/';
		}
	}

    //pagination
	$scope.paginate = function(value) {
		$scope.totalItems = $scope.$parent.projects.length;
		var begin, end, index;
		begin = ($scope.currentPage - 1) * $scope.numPerPage;
		end = begin + $scope.numPerPage;
		index = $scope.$parent.projects.indexOf(value);
		return (begin <= index && index < end);
	};
});