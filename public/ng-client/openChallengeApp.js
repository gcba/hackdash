var ocApp = angular.module('oc-project',['ngRoute','restangular','textAngular','colorpicker.module','ngSocial','filters','ui.bootstrap','ngCsv']);
ocApp.config(function($routeProvider) {

  $routeProvider.
    when('/', {
      title: 'Home',
      controller:'homeCtrl', 
      templateUrl:'/ng-client/modules/home/home.html'
    })
    .when('/challenge/add', {
      templateUrl:'/ng-client/modules/challenge/add.html'
    })
    .when('/challenge/:challengeId', {
      templateUrl:'/ng-client/modules/challenge/view.html'
    })
    .when('/challenge/:challengeId/edit', {
      templateUrl:'/ng-client/modules/challenge/edit.html'
    })
    .when('/challenge/:challengeId/edit/projects', {
      controller:'challengeCtrl', 
      templateUrl:'/ng-client/modules/challenge/projects.html'
    })
    .when('/challenge/:challengeId/:userId/edit/myprojects', {
      controller:'challengeCtrlPub', 
      templateUrl:'/ng-client/modules/challenge/myprojects.html'
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

ocApp.factory('httpInterceptor', function ($q, $rootScope, $log) {
    var numLoadings = 0;
    return {
        request: function (config) {
            numLoadings++;
            // Show loader
            $rootScope.$broadcast("loader_show");
            return config || $q.when(config)
        },
        response: function (response) {
            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast("loader_hide");
            }
            return $q.reject(response);
        }
    };
})
ocApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});



ocApp.run(function ($rootScope, $timeout, Restangular, $route) {

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

	$rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
    $rootScope.title = '';
  });

  //Permissions
  $rootScope.isAbleTo = function(permi, challenge){
    if(challenge && challenge.stages){
        var current = this.getCurrentStages(challenge);
        return current.permissions.indexOf(permi) != -1;
    }
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

  $rootScope.getCssColor = function(challenge){
    if(challenge && challenge.call_to_action && challenge.call_to_action.bgcolor){
      return { color: challenge.call_to_action.bgcolor };
    }
  }

  $rootScope.getCssBorderTop = function(challenge){
    if(challenge && challenge.call_to_action && challenge.call_to_action.bgcolor){
      return { "border-top-color": challenge.call_to_action.bgcolor };
    }
  }

  //challenge.link_color

  $rootScope.getCssJumbotron = function(challenge){
    var s = {};
    if(challenge && challenge.call_to_action && challenge.call_to_action.bgcolor){
      s["border-bottom-color"] = challenge.call_to_action.bgcolor;
    }
    if(challenge && challenge.header_images && challenge.header_images[0]){
      s["background-image"] = 'url(' + challenge.header_images[0] + ')';
    }
    return s;
  }

  $rootScope.getCssButtonColors = function(challenge){
    if(challenge && challenge.call_to_action && challenge.call_to_action.bgcolor){
      return { 
        "background-color": challenge.call_to_action.bgcolor,
        "border-color": challenge.call_to_action.bgcolor,
        color: challenge.call_to_action.color
        };
    }
  }
  
  $rootScope.slugify = function(text){
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-');
  }

  $rootScope.generateUUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  }
  
  $rootScope.applyLinkColor = function(){
    $('#view-user-container a').css('color','black');
  };

  $rootScope.applyCssColor = function(challenge, id){
    var selector =   '#'+id+' a:not(.btn),'
            +'#'+id+' h1,'
            +'#'+id+' h2,'
            +'#'+id+' h3,'
            +'#'+id+' h4,'
            +'#'+id+' h5,'
            +'#myModalLabel,'
            +'.modal-body label';
    $timeout(function() {
      angular.element(selector).css('color',challenge.call_to_action.bgcolor);
    }, 500);
  }
  
  var translatables = { 
    "es": { 
      "close": "Cerrado",
      "open": "Abierto",
      "coming_soon": "Proximamente",
      "5-submitted": "Postulada",
      "4-finals": "Finalistas",
      "4-special-mention": "Mención especial",
      "3-price": "3° Puesto",
      "2-price": "2° Puesto",
      "1-price": "1° Puesto",
      "1-winner": "Ganador",
      "text": "Texto",
      "faq": "Preguntas frecuentes",
      "rules": "Reglas",
      "jury": "Jurado",
      "prizes": "Premios",
      "stages": "Etapas",
      "submissions": "Participaciones",
      "edit-submit": "Editar - Participar",
      "edit-vote": "Editar - Votos",
      "submit": "Participar",
      "public-vote": "Votar",
      "information": "Información",
      "user": "Usuario",
      "admin": "Admistrador",
      "superadmin": "Super administrador",
      "true": "si",
      "false": "no"
    } 
  }

  $rootScope.LANGUANJE = "es";

  $rootScope.t = function(s){
    return translatables[$rootScope.LANGUANJE][s];
  }

  $rootScope.containsObject = function(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i]["name"] === obj) {
            return true;
        }
    } 
    return false;
  }
});


angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });
