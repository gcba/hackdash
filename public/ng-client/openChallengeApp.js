var ocApp = angular.module('oc-project',['ngRoute','restangular']);

ocApp.config(function($routeProvider) {

	$routeProvider.
	  when('/', {
	    controller:'homeCtrl', 
	    templateUrl:'/ng-client/modules/home/home.html'
	  })
	  .when('/challenge/add', {
	    controller:'challengeCtrl', 
	    templateUrl:'/ng-client/modules/challenge/add.html',
	    resolve: {
          action: function(){
            return 'add';
          }
        }
	  })
	  .when('/challenge/:challengeId/edit', {
	    controller:'challengeCtrl', 
	    templateUrl:'/ng-client/modules/challenge/edit.html',
	    resolve: {
          action: function(){
            return 'edit';
          }
        }
	  })
	  .when('/challenge/:challengeId', {
	    controller:'challengeCtrl', 
	    templateUrl:'/ng-client/modules/challenge/view.html',
	    resolve: {
          action: function(){
            return 'view';
          }
        }
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