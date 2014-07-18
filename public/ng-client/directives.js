/*directives*/
ocApp.directive('fieldFormatter', function($compile, $rootScope, $sce) {

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
			
			$scope.getTemplate = function(contentType, viewMode) {
				var templateLoader
					,	templateUrl
					,	baseUrl = '/ng-client/modules/partials/formatters/'
					,	typeMap = {
							title: 'title',
							description: 'description',
							cover: 'image',
							link: 'link',
							imageurl: 'image',
							videourl: 'video',
							text: 'text',
							fileurl: 'link',
							tags: 'tags'
					};

					templateUrl = baseUrl + typeMap[contentType] + '/' + viewMode + '.html';
					templateLoader = $http.get(templateUrl, {cache: $templateCache});
					return templateLoader;
			};
		}],
		link: function(scope, iElement, iAttrs) {
			var loader = scope.getTemplate(scope.fieldSchema.type, iAttrs.viewMode);
			if(scope.fieldSchema.type === 'videourl'){
				scope.fieldData =  $sce.trustAsResourceUrl('//www.youtube.com/embed/' + scope.fieldData);
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