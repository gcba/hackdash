var ocApp = angular.module('oc-project',['ngRoute','restangular']);

ocApp.config(function($routeProvider) {

	$routeProvider.
	  when('/', {
	    controller:'homeCtrl', 
	    templateUrl:'/ng-client/modules/home/home.html'
	  })
	  .when('/challenge/:challengeId', {
	    controller:'challengeCtrl', 
	    templateUrl:'/ng-client/modules/challenge/view.html'
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
	  .when('/admin/users', {
	    controller:'adminUsersCtrl', 
	    templateUrl:'/ng-client/modules/admin/listUsers.html'
	  })
 	 /* .when('/superadmin/challenges', {
	    controller:'superAdminChallengesCtrl', 
	    templateUrl:'/ng-client/superadmin/challenge/view.html'
	  })*/
	  .otherwise({redirectTo:'/'});
});

ocApp.run(function ($rootScope, Restangular) {

	Restangular.setBaseUrl('/api/v2');

	$rootScope.user = window.openchallenge.user;

});