vsGoogleAutocomplete.directive('vsGoogleAutocomplete', ['vsGooglePlaceUtility', '$timeout', function(vsGooglePlaceUtility, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
		scope: {
 			vsGoogleAutocomplete: '=',
            vsPlaceDetails: '=?',
			vsPlaceId: '=?',
			vsStreetNumber: '=?',
			vsStreet: '=?',
			vsCity: '=?',
			vsState: '=?',
			vsCountryShort: '=?',
			vsCountry: '=?'
        },
		controller: function($scope, $element, $attrs) {
		    var self = this;
            this.services = {
			    isolatedScope: $scope
			};
            this.exportServices = function(Services) {
                for(var serviceName in Services) {
                    var service = Services[serviceName];
                    self.services[serviceName] = service;
                }
            };
		},
        link:function(scope, element, attrs, modelController) {
			var input = element[0],
                options = scope.vsGoogleAutocomplete || {},
			    autocomplete = new google.maps.places.Autocomplete(input, options),
			    viewValue;
			
			function updateAddrComponents(place) {
			    scope.vsPlaceId      = !!attrs.vsPlaceId      ? vsGooglePlaceUtility.getPlaceId(place)      : undefined;
				scope.vsStreetNumber = !!attrs.vsStreetNumber ? vsGooglePlaceUtility.getStreetNumber(place) : undefined;
				scope.vsStreet       = !!attrs.vsStreet       ? vsGooglePlaceUtility.getStreet(place)       : undefined;
				scope.vsCity         = !!attrs.vsCity         ? vsGooglePlaceUtility.getCity(place)         : undefined;		
				scope.vsState        = !!attrs.vsState        ? vsGooglePlaceUtility.getState(place)        : undefined;
				scope.vsCountryShort = !!attrs.vsCountryShort ? vsGooglePlaceUtility.getCountryShort(place) : undefined;
				scope.vsCountry      = !!attrs.vsCountry      ? vsGooglePlaceUtility.getCountry(place)      : undefined;
			}
			
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var placeDetails = autocomplete.getPlace();
				viewValue = placeDetails.formatted_address || placeDetails.name;
				scope.$apply(function() {
				    scope.vsPlaceDetails = placeDetails;
					updateAddrComponents(placeDetails);
					modelController.$setViewValue(viewValue);
                    modelController.$render();					    
				});
            });
			
			element.on('focusout', function(event) {
                $timeout(function() {
				    scope.$apply(function() {
				    	modelController.$setViewValue(viewValue);
                        modelController.$render();
				    });
				});
            });
			
			google.maps.event.addDomListener(input, 'keydown', function(e) { 
                if (e.keyCode == 13) { 
                    e.preventDefault(); 
                }
            });
        } 
    };
}]);