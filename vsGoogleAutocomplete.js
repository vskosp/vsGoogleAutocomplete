angular.module('vsGoogleAutocomplete', [])
	.directive('vsGoogleAutocomplete', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
			scope: {
     			vsGoogleAutocomplete: '=',
                vsPlaceDetails: '='
            },
            link:function(scope, element, attrs, NgModelController) {
				var input = element[0],
                    options = scope.vsGoogleAutocomplete || {};
					
				var autocomplete = new google.maps.places.Autocomplete(input, options);
				var viewValue;
				
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var placeDetails = autocomplete.getPlace();
					viewValue = placeDetails.formatted_address || placeDetails.name;
					scope.$apply(function() {
					    scope.vsPlaceDetails = placeDetails;
						NgModelController.$setViewValue(viewValue);
                        NgModelController.$render();  
					});
                });
				
				element.on('focusout', function(event) {
                    scope.$apply(function() {
						NgModelController.$setViewValue(viewValue);
                        NgModelController.$render();
					});
                });
            } 
        }
    });