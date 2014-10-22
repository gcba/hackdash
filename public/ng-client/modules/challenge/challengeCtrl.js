ocApp.controller('challengeCtrl', function($scope, $routeParams, Restangular, $location, $rootScope, $sce, $timeout, $route, $window) {
	$scope.challenge = {
		pages: [],
		header_images: [],
		submit_fields: [],
		stages: [],
		categories: []
	};

	$scope.filterObj = {
		important: true
	};

	$scope.filter = {};

	$scope.order = "";

	$scope.currentStages = [];

	$scope.fieldOrders = [1,2,3,4,5,6,7,8,9];

	$scope.isAdmin = false;

	$scope.submited = false;

	$scope.newTitle = 'sin-titulo-0';

	$scope.linkedinshares = 0;
	$scope.facebookshares = 0;

	//Inits
	$scope.editProjectsInit = function(){
		$scope.checkCanEdit();
		if(!$rootScope.user || !$scope.userCanEdit){
			$location.path('/challenge/'+$routeParams.challengeId);
		}
		$scope.isAdmin = true;
		$scope.loadChallenge(false);
	};

	$scope.checkCanEdit = function(){
		if($rootScope.user){
			$scope.userCanEdit = ($rootScope.user.admin_in.indexOf($routeParams.challengeId) >= 0);
		}
	};

	$scope.applyAccordion = function(){
		$('.collapse').collapse();
	}

	$scope.getTitle = function(page){
		return page.title ? page.title : 'Sin título';
	}

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
		$('#myTab').on('click', 'a', function (e) {
		  e.preventDefault();
		  $(this).tab('show');
		});
	};

	//Common
	$scope.loadChallenge = function(isEdit){
		if($routeParams.challengeId){
			Restangular.one('dashboards', $routeParams.challengeId).get()
				.then(function(challenge){
			  		$scope.challenge = challenge;
			  		$('#page a').css('color', $scope.challenge.link_color);
			  		$scope.currentStages = $rootScope.getCurrentStages(challenge);
			  		$rootScope.title = ' - ' + $scope.challenge.title;
			  		if(isEdit){
			  			$scope.preprocessCollections();
			  		}else{
			  			$scope.allowHtmlInPages();
			  		}
				});
				if($scope.isAdmin){
					$scope.projects = Restangular.one('admin_dashboards', $routeParams.challengeId).getList('projects').$object;
				} else {
					$scope.projects = Restangular.one('dashboards', $routeParams.challengeId).getList('projects').$object;
				}
			$scope.admins = Restangular.one('dashboards', $routeParams.challengeId).getList('admins').$object;
		}
	};

	$scope.explicitlyTrustedHtml = $sce.trustAsHtml(
      '<span onmouseover="this.textContent="Explicitly trusted HTML bypasses ' +
      'sanitization."">Hover over this text.</span>');

	$scope.allowHtmlInPages = function(){
		
		//permissions
		angular.forEach($scope.challenge.pages, function(s,k){
			s.text = $sce.trustAsHtml(s.text);
		});

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
		if(submitField.type && submitField.label && submitField.help && submitField.order){
			submitField.important = (submitField.important == "true");
			$scope.challenge.submit_fields.push(angular.copy(submitField));
			$scope.projectOptions.splice($scope.projectOptions.indexOf(submitField.type),1);
			submitField.type = '';
			submitField.help = '';
			submitField.label = '';
			submitField.order = '';
			submitField.important = false;
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
		project.challenge_id = $scope.challenge._id;
		Restangular.all("projects")
			.post(project)
			.then(function(e){
				$location.path('/submit/'+e._id);
				$('#participate').modal('hide');
				$('body').removeClass('modal-open');
				$( "div" ).remove('.modal-backdrop.in');
			}, function(response) {
				console.log("Error with status code", response.status);
			});

	};

	$scope.openParticipatePopup = function(id){
		if($rootScope.user){
			$('#participate').modal('show');
		} else {
			$window.location.href = '/auth/openid/';
		}
	};

	$scope.openProjectPopup = function(id){
		$('#project-'+id).modal('show');
	};

	$scope.changeFilter = function() {
    $scope.projects = [];
      Restangular.one('dashboards', $routeParams.challengeId).getList('projects',{cat:$scope.filter.cat, order:$scope.filter.order})
		.then(function(projects){
			switch($scope.filter.order) {
			    case 'date':
			        $scope.projects = projects.sort(function(a,b){
						if ( a.created_at <= b.created_at ) {
	                	return( 1 );
		                }
		                return( -1 );
					});
			        break;
			    case 'status':
			        $scope.projects = projects.sort(function(a,b){
						if ( a.status <= b.status ) {
	                	return( 1 );
		                }
		                return( -1 );
					});
			        break;
			    case 'votes':
			        $scope.projects = projects.sort(function(a,b){
						if ( a.followers.length <= b.followers.length ) {
	                	return( 1 );
		                }
		                return( -1 );
					});
			        break;
			    default:
			         $scope.projects = projects;
			}
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

	$scope.update = function(challenge, formChallenge){
		if(formChallenge.$valid){
			angular.forEach(challenge.stages, function(s,k){
				delete s.permissionOptions;
			});

			challenge.put().then(function(e){
				$location.path('/challenge/'+e._id);
			});
		}else{
			$scope.submited = true;
			$timeout(function(){
				document
				.querySelector('.form-error:not(.ng-hide)')
				.parentNode
				.scrollIntoView(true);
			}, 0);
		}
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

	$scope.removeProject = function(project){
		project.remove().then(function(){
			$scope.projects = _.without($scope.projects, _.findWhere($scope.projects, {_id: project._id}));
		});
	};

	$scope.paginate = function(value) {
		$scope.totalItems = $scope.projects.length;
		var begin, end, index;
		begin = ($scope.currentPage - 1) * $scope.numPerPage;
		end = begin + $scope.numPerPage;
		index = $scope.projects.indexOf(value);
		return (begin <= index && index < end);
	};	

	$scope.currentPage = 1;
	$scope.numPerPage = 10;
    $scope.sort_by = function(predicate) {
		$scope.predicate = predicate;
		$scope.reverse = !$scope.reverse;
	};



	$scope.exportData = function(){
	    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	    $.getJSON( "http://local.host:3000/api/v2/projects/export", function( data ) {
	    	JSONData = data;

		    ReportTitle = "Participaciones";
		    ShowLabel = true;
		    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		    
		    var CSV = '';    
		    //Set Report title in first row or line
		    
		    CSV += ReportTitle + '\r\n\n';

		    //This condition will generate the Label/Header
		    if (ShowLabel) {
		        var row = "";
		        
		        //This loop will extract the label from 1st index of on array
		        for (var index in arrData[0]) {
		            
		            //Now convert each value to string and comma-seprated
		            row += index + ',';
		        }

		        row = row.slice(0, -1);
		        
		        //append Label row with line break
		        CSV += row + '\r\n';
		    }
		    
		    //1st loop is to extract each row
		    for (var i = 0; i < arrData.length; i++) {
		        var row = "";
		        
		        //2nd loop will extract each column and convert it in string comma-seprated
		        for (var index in arrData[i]) {
		            row += '"' + arrData[i][index] + '",';
		        }

		        row.slice(0, row.length - 1);
		        
		        //add a line break after each row
		        CSV += row + '\r\n';
		    }

		    if (CSV == '') {        
		        alert("Invalid data");
		        return;
		    }   
		    
		    //Generate a file name
		    var fileName = "Participaciones";
		    //this will remove the blank-spaces from the title and replace it with an underscore
		    fileName += ReportTitle.replace(/ /g,"_");   
		    
		    //Initialize file format you want csv or xls
		    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
		    
		    // Now the little tricky part.
		    // you can use either>> window.open(uri);
		    // but this will not work in some browsers
		    // or you will not get the correct file extension    
		    
		    //this trick will generate a temp <a /> tag
		    var link = document.createElement("a");    
		    link.href = uri;
		    
		    //set the visibility hidden so it will not effect on your web-layout
		    link.style = "visibility:hidden";
		    link.download = fileName + ".csv";
		    
		    //this part will append the anchor tag and remove it after automatic click
		    document.body.appendChild(link);
		    link.click();
		    document.body.removeChild(link);
		}); 

	};	
});