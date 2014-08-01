/*directives*/
ocApp.directive('fieldComponent', function($compile, $rootScope, $sce, $timeout) {

	return {
		restrict: 'E',
		scope: {
			fieldSchema: '=',
			fieldData: '=',
			fieldWidth: '@',
			fieldHeight: '@'
		},
		transclude: true,
		controller: ['$scope', '$http', '$templateCache', '$compile', function($scope, $http, $templateCache, $compile) {
			console.log('RUN CONTROLLER');
			var buildTemplateFunc = function(tMap, bUrl){
				return function tmplFunc(contentType, viewMode){
					var templateLoader
						,	templateUrl
						,	baseUrl = bUrl
						,	typeMap = tMap;

						templateUrl = baseUrl + typeMap[contentType] + '/' + viewMode + '.html';
						templateLoader = $http.get(templateUrl, {cache: $templateCache});
						return templateLoader;
					}
			}

			$scope.getFieldTmpl = buildTemplateFunc({
				title: 'title',
				description: 'description',
				cover: 'image',
				link: 'link',
				imageurl: 'image',
				videourl: 'video',
				text: 'text',
				fileurl: 'link',
				tags: 'tags'
			}, '/ng-client/modules/partials/formatters/');

			$scope.getWidgetFieldTmpl = buildTemplateFunc({
				title: 'text',
				description: 'textarea',
				cover: 'image',
				link: 'text',
				imageurl: 'image',
				videourl: 'text',
				text: 'text',
				fileurl: 'file',
				tags: 'text'
			}, '/ng-client/modules/partials/form-widgets/');


			$scope.initFileDrop = function(name){
				var $dragdrop = $('#' + name);

				$dragdrop.filedrop({
					fallback_id: name + '_fall',
					url: '/api/v2/projects/upload_file',
					paramname: name,
					allowedfiletypes: ['image/jpeg','image/png','image/gif'],
					maxfiles: 1,
					maxfilesize: 3,
					dragOver: function () {
						$dragdrop.css('background', 'rgb(226, 255, 226)');
					},
					dragLeave: function () {
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					drop: function () {
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					uploadFinished: function(i, file, res) {
						$scope.$parent.project[name] = res.href;
						$dragdrop
						.addClass('file-selected')
						.children('p').html(res.href);
					}
				});
			};

			$scope.initImageFiledrop = function(name){
				var $dragdrop = $('#' + name);

				$dragdrop.filedrop({
					fallback_id: name + '_fall',
					url: '/api/v2/projects/upload_file',
					paramname: name,
					allowedfiletypes: ['image/jpeg','image/png','image/gif'],
					maxfiles: 1,
					maxfilesize: 3,
					dragOver: function () {
						$dragdrop.css('background', 'rgb(226, 255, 226)');
					},
					dragLeave: function () {
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					drop: function () {
						console.log('drop');
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					uploadFinished: function(i, file, res) {
						
						$scope.$parent.project[name] = res.href;

						$dragdrop
						.css('background', 'url(' + res.href + ')')
						.css('backgroundSize', 'cover')
						.addClass("project-image")
						.children('p').hide();
					}
				});

			};

		}],
		link: function(scope, iElement, iAttrs) {
			if(iAttrs.edit){
				var loader = scope.getWidgetFieldTmpl(scope.fieldSchema.type, iAttrs.viewMode);
			}else{
				var loader = scope.getFieldTmpl(scope.fieldSchema.type, iAttrs.viewMode);
				if(scope.fieldSchema.type === 'videourl' && scope.fieldData){
					if(iAttrs.viewMode === 'full'){
						scope.fieldData =  $sce.trustAsResourceUrl('//www.youtube.com/embed/' + scope.fieldData);
					}else{
						scope.fieldData =  $sce.trustAsResourceUrl('http://img.youtube.com/vi/' + scope.fieldData + '/0.jpg');
					}
				}
			}
			var promise = loader.success(function(html) {
				iElement.html(html);
			}).then(function (response) {
				iElement.replaceWith($compile(iElement.html())(scope));
				$timeout(function(){
					if(scope.fieldSchema.type === 'imageurl' || scope.fieldSchema.type === 'cover'){
						scope.initImageFiledrop(scope.fieldSchema.type);
					} else if(scope.fieldSchema.type === 'fileurl'){
						scope.initFileDrop(scope.fieldSchema.type);
					}
				});
			});
		}
	}
});
//TODO
ocApp.directive('imageDrop', function ($window, $timeout) {
	return {
		restrict: 'E',
		transclude: true,
		template: '<label ng-style="$root.getCssColor($parent.challenge)">{{fieldSchema.label}}</label><div id="{{fieldSchema.type}}" class="project-image dragdrop"><p>Arrastre la imágen aquí<input type="file" name="{{fieldSchema.type}}_fall" id="{{fieldSchema.type}}_fall"/></p></div><small>{{fieldSchema.help}}</small>',
		controller: ['$scope', function($scope) {	

			$scope.initImageFiledrop = function(node){
				var $dragdrop = $(node).find('.dragdrop:first');

				$dragdrop.addClass('dragdrop project-image');
				$dragdrop.filedrop({
					fallback_id: 'header_fall',
					url: '/api/v2/projects/upload_file',
					paramname: name,
					allowedfiletypes: ['image/jpeg','image/png','image/gif'],
					maxfiles: 1,
					maxfilesize: 3,
					dragOver: function () {
						console.log('leave');
						$dragdrop.css('background', 'rgb(226, 255, 226)');
					},
					dragLeave: function () {
						console.log('leave');
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					drop: function () {
						console.log('drop');
						$dragdrop.css('background', 'rgb(241, 241, 241)');
					},
					uploadFinished: function(i, file, res) {
						
						$scope.$parent.challenge.header_images[0] = res.href;

						$dragdrop
						.css('background', 'url(' + res.href + ')')
						.css('backgroundSize', 'cover')
						.addClass("project-image")
						.children('p').hide();
					}
				});
			};

		}],
		link: function(scope, iElement, iAttrs){
			$timeout(function(){
				console.log('aca');
				scope.initImageFiledrop(iElement);
			}, 0);
		}
	}
});

ocApp.directive('appDatetime', function ($window) {
		return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, element, attrs, ngModel) {
						var moment = $window.moment;

						ngModel.$formatters.push(formatter);
						ngModel.$parsers.push(parser);

						element.on('change', function (e) {
								var element = e.target;
								element.value = formatter(ngModel.$modelValue);
						});

						function parser(value) {
								var m = moment(value, 'DD-MM-YYYY', true);
								var valid = m.isValid();
								ngModel.$setValidity('datetime', valid);
								if (valid) return m.valueOf();
								else return value;
						}

						function formatter(value) {
								if(!value) return '';
								var m = moment(value);
								
								var valid = m.isValid();
								if (valid) return m.format('DD-MM-YYYY');
								else return value;
						}

				}
		};
});

ocApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last) {
							scope.$evalAsync(attr.onFinishRender);
						}
        }
    }
});

