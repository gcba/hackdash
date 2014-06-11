var ocApp = angular.module('oc-project',['ngRoute','restangular','textAngular']);

ocApp.config(function($routeProvider) {

	$routeProvider.
	  when('/', {
	    controller:'homeCtrl', 
	    templateUrl:'/ng-client/modules/home/home.html'
	  })
	  .when('/challenge/add', {
	    templateUrl:'/ng-client/modules/challenge/add.html'
	  })
	  .when('/challenge/:challengeId', {
	    templateUrl:'/ng-client/modules/challenge/view.html',
	  })
	  .when('/challenge/:challengeId/edit', {
	    templateUrl:'/ng-client/modules/challenge/edit.html',
	  })
	  .when('/challenge/:challengeId/edit/projects', {
	    controller:'challengeCtrl', 
	    templateUrl:'/ng-client/modules/challenge/projects.html',
	  })
	 .when('/submit/:projectId', {
	    templateUrl:'/ng-client/modules/project/view.html'
	  })
	  .when('/profile/:profileId', { //public user profile
	    controller:'viewProfileCtrl', 
	    templateUrl:'/ng-client/modules/user/view.html'
	  })
	  .when('/profile', { //edit profile for logged user
	    controller:'editProfileCtrl', 
	    templateUrl:'/ng-client/modules/user/edit.html'
	  })
	  .when('/login', {
	    controller:'loginCtrl', 
	    templateUrl:'/ng-client/modules/login/login.html'
	  })
	  .otherwise({redirectTo:'/'});

	//SuperAdmin
	$routeProvider
 	  .when('/admin/users/:userId', {
	    controller:'adminUsersCtrl', 
	    templateUrl:'/ng-client/modules/admin/editUser.html'
	  })
	  .when('/admin/users', {
	    controller:'adminUsersCtrl', 
	    templateUrl:'/ng-client/modules/admin/listUsers.html'
	  })
	  .when('/admin/challenges', {
	    controller:'adminChallengesCtrl', 
	    templateUrl:'/ng-client/modules/admin/listChallenges.html'
	  })
	  .otherwise({redirectTo:'/'});
});

ocApp.run(function ($rootScope, Restangular) {

	Restangular.setBaseUrl('/api/v2');

	Restangular.setRestangularFields({
	  id: "_id"
	});

	$rootScope.booleans = [
		{key:true,label:'Verdadero'},
		{key:false,label:'Falso'},
	];

	angular.extend($rootScope,window.openchallenge);

	$rootScope.refreshUser = function(cb){
		Restangular.one('profiles', $rootScope.user._id).get().then(function(user){
			$rootScope.user = user;
			if(cb){
				cb();
			}
		});
	} 

	//Permissions
	$rootScope.isAbleTo = function(permi, challenge){
	    var current = this.getCurrentStages(challenge);
	    return current.permissions.indexOf(permi) != -1;
	}

	$rootScope.getCurrentStages = function(challenge){
	    var today = new Date().getTime();
	    var current = {stages:[],permissions:[]};
	    angular.forEach(challenge.stages, function(e,i){
	        var start = Date.parse(e.start);
	        var end = Date.parse(e.end);
	        if( start < today && today < end ){
	            current.stages.push(e);
	            current.permissions = current.permissions.concat(e.permissions);
	        }
	    });
	    current.permissions = jQuery.unique( current.permissions );
	    return current;
	}

});