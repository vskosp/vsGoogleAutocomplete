/**
 * vsGoogleAutocomplete - v0.5.0 - 2015-11-29
 * https://github.com/vskosp/vsGoogleAutocomplete
 * Copyright (c) 2015 K.Polishchuk
 * License: MIT
 */
(function (window, document) {
'use strict';
angular.module('vsGoogleAutocomplete', []);

angular.module('vsGoogleAutocomplete').factory('vsGooglePlaceUtility', function() {
	function isGooglePlace(place) {
		if (!place)
			return false;
		return !!place.place_id;
	}

	function isContainTypes(place, types) {
		var placeTypes,
			placeType,
			type;
		if (!isGooglePlace(place))
			return false;
		placeTypes = place.types;
		for (var i = 0; i < types.length; i++) {
			type = types[i];
			for (var j = 0; j < placeTypes.length; j++) {
				placeType = placeTypes[j];
				if (placeType === type) {
					return true;
				}
			}
		}
		return false;
	}

	function getAddrComponent(place, componentTemplate) {
		var result;
		if (!isGooglePlace(place))
			return;
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (componentTemplate[addressType]) {
				result = place.address_components[i][componentTemplate[addressType]];
				return result;
			}
		}
		return;
	}

	function getPlaceId(place) {
		if (!isGooglePlace(place))
			return;
		return place.place_id;
	}

	function getStreetNumber(place) {
		var COMPONENT_TEMPLATE = { street_number: 'short_name' },
			streetNumber = getAddrComponent(place, COMPONENT_TEMPLATE);
		return streetNumber;
	}

	function getStreet(place) {
		var COMPONENT_TEMPLATE = { route: 'long_name' },
			street = getAddrComponent(place, COMPONENT_TEMPLATE);
		return street;
	}

	function getCity(place) {
		var COMPONENT_TEMPLATE = { locality: 'long_name' },
			city = getAddrComponent(place, COMPONENT_TEMPLATE);
		return city;
	}

	function getState(place) {
		var COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
			state = getAddrComponent(place, COMPONENT_TEMPLATE);
		return state;
	}

	function getDistrict(place) {
		var COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
			state = getAddrComponent(place, COMPONENT_TEMPLATE);
		return state;
	}

	function getCountryShort(place) {
		var COMPONENT_TEMPLATE = { country: 'short_name' },
			countryShort = getAddrComponent(place, COMPONENT_TEMPLATE);
		return countryShort;
	}

	function getCountry(place) {
		var COMPONENT_TEMPLATE = { country: 'long_name' },
			country = getAddrComponent(place, COMPONENT_TEMPLATE);
		return country;
	}
	function getPostCode(place) {
		var COMPONENT_TEMPLATE = { postal_code: 'long_name' },
			postCode = getAddrComponent(place, COMPONENT_TEMPLATE);
		return postCode;
	}

	function isGeometryExist(place) {
		return angular.isObject(place) && angular.isObject(place.geometry);
	}

	function getLatitude(place) {
		if (!isGeometryExist(place)) return;
		return place.geometry.location.lat();
	}

	function getLongitude(place) {
		if (!isGeometryExist(place)) return;
		return place.geometry.location.lng();
	}

	return {
		isGooglePlace: isGooglePlace,
		isContainTypes: isContainTypes,
		getPlaceId: getPlaceId,
		getStreetNumber: getStreetNumber,
		getStreet: getStreet,
		getCity: getCity,
		getState: getState,
		getCountryShort: getCountryShort,
		getCountry: getCountry,
		getLatitude: getLatitude,
		getLongitude: getLongitude,
		getPostCode: getPostCode,
		getDistrict: getDistrict
	};
});

angular.module('vsGoogleAutocomplete').directive('vsGoogleAutocomplete', ['vsGooglePlaceUtility', '$timeout', function(vsGooglePlaceUtility, $timeout) {
	return {
		restrict: 'A',
		require: ['vsGoogleAutocomplete', 'ngModel'],
		scope: {
			vsGoogleAutocomplete: '=',
			vsPlace: '=?',
			vsPlaceId: '=?',
			vsStreetNumber: '=?',
			vsStreet: '=?',
			vsCity: '=?',
			vsState: '=?',
			vsCountryShort: '=?',
			vsCountry: '=?',
			vsPostCode: '=?',
			vsLatitude: '=?',
			vsLongitude: '=?',
			vsDistrict: '=?'
		},
		controller: ['$scope', '$attrs', function($scope, $attrs) {
			this.isolatedScope = $scope;

			/**
			 * Updates address components associated with scope model.
			 * @param {google.maps.places.PlaceResult} place PlaceResult object
			 */
			this.updatePlaceComponents = function(place) {
				$scope.vsPlaceId       = !!$attrs.vsPlaceId  && place     ? vsGooglePlaceUtility.getPlaceId(place)      : undefined;
				$scope.vsStreetNumber  = !!$attrs.vsStreetNumber && place ? vsGooglePlaceUtility.getStreetNumber(place) : undefined;
				$scope.vsStreet        = !!$attrs.vsStreet && place       ? vsGooglePlaceUtility.getStreet(place)       : undefined;
				$scope.vsCity          = !!$attrs.vsCity && place         ? vsGooglePlaceUtility.getCity(place)         : undefined;
				$scope.vsPostCode      = !!$attrs.vsPostCode && place     ? vsGooglePlaceUtility.getPostCode(place)     : undefined;
				$scope.vsState         = !!$attrs.vsState && place        ? vsGooglePlaceUtility.getState(place)        : undefined;
				$scope.vsCountryShort  = !!$attrs.vsCountryShort && place ? vsGooglePlaceUtility.getCountryShort(place) : undefined;
				$scope.vsCountry       = !!$attrs.vsCountry && place      ? vsGooglePlaceUtility.getCountry(place)      : undefined;
				$scope.vsLatitude      = !!$attrs.vsLatitude && place     ? vsGooglePlaceUtility.getLatitude(place)     : undefined;
				$scope.vsLongitude     = !!$attrs.vsLongitude && place    ? vsGooglePlaceUtility.getLongitude(place)    : undefined;
				$scope.vsDistrict      = !!$attrs.vsDistrict && place     ? vsGooglePlaceUtility.getDistrict(place)     : undefined;
			};
		}],
		link: function(scope, element, attrs, ctrls) {
			// controllers
			var autocompleteCtrl = ctrls[0],
				modelCtrl = ctrls[1];

			// google.maps.places.Autocomplete instance (support google.maps.places.AutocompleteOptions)
			var autocompleteOptions = scope.vsGoogleAutocomplete || {},
				autocomplete = new google.maps.places.Autocomplete(element[0], autocompleteOptions);

			// google place object
			var place;

			// value for updating view
			var	viewValue;

			// updates view value and address components on place_changed google api event
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				place = autocomplete.getPlace();
				viewValue = place.formatted_address || modelCtrl.$viewValue;
				scope.$apply(function() {
					scope.vsPlace = place;
					autocompleteCtrl.updatePlaceComponents(place);
					modelCtrl.$setViewValue(viewValue);
					modelCtrl.$render();
				});
			});

			// updates view value on focusout
			element.on('blur', function(event) {
				viewValue = (place && place.formatted_address) ? viewValue : modelCtrl.$viewValue;
				$timeout(function() {
					scope.$apply(function() {
						modelCtrl.$setViewValue(viewValue);
						modelCtrl.$render();
					});
				});
			});

			// prevent submitting form on enter
			google.maps.event.addDomListener(element[0], 'keydown', function(e) {
				if (e.keyCode == 13) {
					e.preventDefault();
				}
			});
		}
	};
}]);

})(window, document);