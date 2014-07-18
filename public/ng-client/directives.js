/*directives*/
ocApp.directive('fieldComponent', function($compile, $rootScope, $sce) {

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
		
		}],
		link: function(scope, iElement, iAttrs) {
			if(iAttrs.edit){
				var loader = scope.getWidgetFieldTmpl(scope.fieldSchema.type, iAttrs.viewMode);
			}else{
				var loader = scope.getFieldTmpl(scope.fieldSchema.type, iAttrs.viewMode);
				if(scope.fieldSchema.type === 'videourl'){
					scope.fieldData =  $sce.trustAsResourceUrl('//www.youtube.com/embed/' + scope.fieldData);
				}
			}

			var promise = loader.success(function(html) {
				iElement.html(html);
			}).then(function (response) {
				iElement.replaceWith($compile(iElement.html())(scope));
			});
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
								console.log(valid);
								ngModel.$setValidity('datetime', valid);
								if (valid) return m.valueOf();
								else return value;
						}

						function formatter(value) {
								var m = moment(value);
								var valid = m.isValid();
								if (valid) return m.format('DD-MM-YYYY');
								else return value;
						}

				} //link
		};

});