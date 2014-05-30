var ocApp = angular.module('oc-project',['ngRoute','restangular']);

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
	    controller:'projectCtrl', 
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
	  .otherwise({redirectTo:'/'});

	//SuperAdmin
	$routeProvider.
	  when('/admin', {
	  	redirectTo:'/admin/challenges'
	  })
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

	angular.extend($rootScope,window.openchallenge);

	$rootScope.refreshUser = function(cb){
		Restangular.one('profiles', $rootScope.user._id).get().then(function(user){
			$rootScope.user = user;
			if(cb){
				cb();
			}
		});
	} 

});