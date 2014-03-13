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
	  .otherwise({redirectTo:'/'});
});

ocApp.run(function ($rootScope, Restangular) {

	Restangular.setBaseUrl('/api/v2');

	$rootScope.user = window.openchallenge.user;

});