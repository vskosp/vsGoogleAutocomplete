/**
 * vsGoogleAutocomplete - v0.5.0 - 2015-11-29
 * https://github.com/vskosp/vsGoogleAutocomplete
 * Copyright (c) 2015 K.Polishchuk
 * License: MIT
 */
(function (window, document) {
'use strict';
angular.module('vsGoogleAutocomplete').factory('vsEmbeddedValidatorsInjector', ['$injector', function($injector) {
	var validatorsHash = [];

	/**
	 * Class making embedded validator.
	 * @constructor
	 * @param {string} name - validator name.
	 * @param {function(place)} validateMethod - function that will validate place.
	 */
	function EmbeddedValidator(name, validateMethod) {
		this.name = name;
		this.validate = validateMethod;
	}

	function searchValidator(validatorName) {
		for (var i = 0; i < validatorsHash.length; i++) {
			if(validatorsHash[i].name === validatorName)
				return validatorsHash[i];
		}
		return;
	}

	function getValidator(validatorName) {
		var validator = searchValidator(validatorName);
		if(!validator) {
			validator = new EmbeddedValidator(validatorName, $injector.get(validatorName));
			validatorsHash.push(validator);
		}
		return validator;
	}

	function getValidators(validatorsNamesList) {
		var validatorsList = [];
		for (var i = 0; i < validatorsNamesList.length; i++) {
			var validator = getValidator(validatorsNamesList[i]);
			validatorsList.push(validator);
		}
		return validatorsList;
	}

	return {
		get: getValidators
	};
}]);

angular.module('vsGoogleAutocomplete').service('vsValidatorFactory', ['vsEmbeddedValidatorsInjector', function(vsEmbeddedValidatorsInjector) {
	/**
	 * Class making validator associated with vsGoogleAutocomplete controller.
	 * @constructor
	 * @param {Array.<string>} validatorsNamesList - List of embedded validator names.
	 */
	function Validator(validatorsNamesList) {
		// add default embedded validator name
		validatorsNamesList.unshift('vsGooglePlace');

		this._embeddedValidators = vsEmbeddedValidatorsInjector.get(validatorsNamesList);
		this.error = {};
		this.valid = true;
	}

	/**
	 * Runs all embedded validators and change the validity state.
	 * @param {google.maps.places.PlaceResult} place - PlaceResult object.
	 */
	Validator.prototype.validate = function(place) {
		var validationErrorKey, isValid;

		for (var i = 0; i < this._embeddedValidators.length; i++) {
			validationErrorKey = this._embeddedValidators[i].name;

			// runs embedded validator only if place is object
			if (angular.isObject(place)) {
				isValid = this._embeddedValidators[i].validate(place);
			} else {
				isValid = false;
			}
			this._setValidity(validationErrorKey, isValid);
		}
	};

	/**
	 * Sets validity.
	 * @param {string} validationErrorKey - Error name.
	 * @param {boolean} isValid - Valid status.
	 */
	Validator.prototype._setValidity = function(validationErrorKey, isValid) {
		// set error
		if (typeof isValid != 'boolean') {
			delete this.error[validationErrorKey];
		} else {
			if (!isValid) {
				this.error[validationErrorKey] = true;
			} else {
				delete this.error[validationErrorKey];
			}
		}
		// set validity
		if (this.error) {
			for (var e in this.error) {
				this.valid = false;
				return;
			}
		}
		this.valid = true;
	};

	this.create = function(validatorsNamesList) {
		return new Validator(validatorsNamesList);
	};
}]);

angular.module('vsGoogleAutocomplete').directive('vsAutocompleteValidator', ['vsValidatorFactory', function(vsValidatorFactory) {
	/**
	 * Parse validator names from attribute.
	 * @param {$compile.directive.Attributes} attrs Element attributes
	 * @return {Array.<string>} Returns array of normalized validator names.
	 */
	function parseValidatorNames(attrs) {
		var attrValue = attrs.vsAutocompleteValidator,
			validatorNames = (attrValue!=="") ? attrValue.trim().split(',') : [];

		// normalize validator names
		for (var i = 0; i < validatorNames.length; i++) {
			validatorNames[i] = attrs.$normalize(validatorNames[i]);
		}

		return validatorNames;
	}

	return {
		restrict: 'A',
		require: ['ngModel', 'vsGoogleAutocomplete'],
		link: function(scope, element, attrs, controllers) {
			// controllers
			var modelCtrl = controllers[0],
				autocompleteCtrl = controllers[1];

			// validator
			var	validatorNames = parseValidatorNames(attrs),
				validator = vsValidatorFactory.create(validatorNames);

			// add validator for ngModel
			modelCtrl.$validators.vsAutocompleteValidator = function() {
				return validator.valid;
			};

			// watch for updating place
			autocompleteCtrl.isolatedScope.$watch('vsPlace', function(place) {
				// validate place
				validator.validate(place);

				// set addr components to undefined if place is invalid
				if (!validator.valid) {
					autocompleteCtrl.updatePlaceComponents(undefined);
				}

				// call modelCtrl.$validators.vsAutocompleteValidator
				modelCtrl.$validate();
			});

			// publish autocomplete errors
			modelCtrl.vsAutocompleteErorr = validator.error;
		}
	};
}]);


//Validator - checks if place is valid Google address
angular.module('vsGoogleAutocomplete').factory('vsGooglePlace', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
	function validate(place) {
		return vsGooglePlaceUtility.isGooglePlace(place);
	}

	return validate;
}]);

//Validator - checks if place is full street address (street number, street, ...)
angular.module('vsGoogleAutocomplete').factory('vsStreetAddress', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
	var PLACE_TYPES = ["street_address", "premise"];

	function validate(place) {
		return vsGooglePlaceUtility.isContainTypes(place, PLACE_TYPES);
	}

	return validate;
}]);
})(window, document);