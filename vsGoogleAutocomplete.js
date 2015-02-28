angular.module('vsGoogleAutocomplete', [])
    .provider('vsValidatorService', function() {
		var validatorsMap = {};
				
		function config(map) {
		    validatorsMap = map;
		}
		
		return {
		    config: config,
		    $get: ['$injector', function($injector) {
			    function getElementValidatorsMap(formName, elementName) {
					var formMap, elementMap;
					formMap = validatorsMap[formName];
				    if(!formMap)
				        return;						
				    elementMap = formMap[elementName];
					return elementMap;
				}
				//
				function getValidatorsNames(formName, elementName) {
				    var validatorsNames = [];
					var elementMap = getElementValidatorsMap(formName, elementName);
					if(!elementMap)
					    return validatorsNames;
					angular.forEach(elementMap, function (extension, validatorName) {
					    validatorsNames.push(validatorName);
					});
					return validatorsNames;
				}
				function injectValidatorFunc(validatorName) {
				    var validatorFuncProvider = $injector.get(validatorName);
					var validatorFunc = validatorFuncProvider.validator;
					
					return validatorFunc;
				}
				//
				function createValidator(validatorName) {
				    var validator = {};				
					validator.validate = injectValidatorFunc(validatorName);
					validator.error = validatorName;
					
					return validator;
				}
				//
				function createValidators(validatorsNames) {
				    var IMBEDDED_VALIDATOR_NAME = 'vsGooglePlace';
		        	var validators = [];
					
					validatorsNames.unshift(IMBEDDED_VALIDATOR_NAME);			
					for(var nameIdx=0; nameIdx < validatorsNames.length; nameIdx++) {
                        var validator = createValidator(validatorsNames[nameIdx]);
						validators.push(validator);
		        	}
					
					return validators;
		        }
				//
				function getValidators(formName, elementName) {
				    var validatorsNames = getValidatorsNames(formName, elementName);
					var validators = createValidators(validatorsNames);
					return validators;
				}
				
			    return {
				    getValidators: getValidators
				};
			}]
		};
	})
	.service('vsValidatorFactory', ['vsValidatorService', function(vsValidatorService) {
	    function Validator(formName, modelController) {
		    this.modelController = modelController;
			this.validators = vsValidatorService.getValidators(formName, modelController.$name);
		}
		Validator.prototype.validate = function(place) {
		    var modelController = this.modelController,
 		        validators = this.validators;
				
		    for (var validatorIdx = 0; validatorIdx < validators.length; validatorIdx++) {
			    var validator = validators[validatorIdx];
				var result = validator.validate(place);
				var error = validator.error;
				modelController.$setValidity(error, result);
			}
		};
	
		this.createValidator = function(formName, modelController) {
		   return new Validator(formName, modelController);
		};
	}])
	.service('vsValidator', ['vsValidatorFactory', function(vsValidatorFactory) {
		this.enable = function(scope, formName, modelController) {
		    var validator = vsValidatorFactory.createValidator(formName, modelController);
			scope.$watch('vsPlaceDetails', function(place) {
				validator.validate(place);
			});
		};
	}])
	.service('vsGooglePlaceUtility', function() {
	    function isGooglePlace(place) {
		    if (!place)
				return false;
			return !!place.place_id;
		}
		this.isGooglePlace = isGooglePlace;
		this.isContainTypes = function(place, types) {
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
		};
		
		this.getPlaceId = function(place) {
		    if (!isGooglePlace(place))
			    return;
			return place.place_id;
		};
		
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
		this.getStreetNumber = function(place) {
		    var COMPONENT_TEMPLATE = { street_number: 'short_name' };
			var streetNumber = getAddrComponent(place, COMPONENT_TEMPLATE);
			return streetNumber;
		};
		this.getStreet = function(place) {
		    var COMPONENT_TEMPLATE = { route: 'long_name' };
			var street = getAddrComponent(place, COMPONENT_TEMPLATE);
			return street;
		};
		this.getCity = function(place) {
		    var COMPONENT_TEMPLATE = { locality: 'long_name' };
			var city = getAddrComponent(place, COMPONENT_TEMPLATE);
			return city;
		};
		this.getState = function(place) {
		    var COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' };
			var state = getAddrComponent(place, COMPONENT_TEMPLATE);
			return state;
		};
		this.getCountryShort = function(place) {
		    var COMPONENT_TEMPLATE = { country: 'short_name' };
			var countryShort = getAddrComponent(place, COMPONENT_TEMPLATE);
			return countryShort;
		};
		this.getCountry = function(place) {
		    var COMPONENT_TEMPLATE = { country: 'long_name' };
			var country = getAddrComponent(place, COMPONENT_TEMPLATE);
			return country;
		};
	})
	.factory('vsGooglePlace', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
	    function validator(place) {
			return vsGooglePlaceUtility.isGooglePlace(place);
		}
		
		return {
		    validator: validator
		};
	}])
	.factory('vsStreetAddress', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
	    var PLACE_TYPES = ["street_address", "premise"];	

		function validator(place) {
			return vsGooglePlaceUtility.isContainTypes(place, PLACE_TYPES);
		}
		
		return {
		    validator: validator
		};
	}])
	.directive('vsGoogleAutocomplete', ['vsGooglePlaceUtility', 'vsValidator', '$timeout', function(vsGooglePlaceUtility, vsValidator, $timeout) {
        return {
            restrict: 'A',
            require: '^^form',
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
            link:function(scope, element, attrs, formController) {
				var NgModelController = formController[attrs.name];
				var input = element[0],
                    options = scope.vsGoogleAutocomplete || {};
					
				var autocomplete = new google.maps.places.Autocomplete(input, options);
				var viewValue;
				
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
						NgModelController.$setViewValue(viewValue);
                        NgModelController.$render();					    
					});
                });
				
				element.on('focusout', function(event) {
                    $timeout(function() {
  					    scope.$apply(function() {
					    	NgModelController.$setViewValue(viewValue);
                            NgModelController.$render();
					    });
					});
                });

				vsValidator.enable(scope, formController.$name, NgModelController);
            } 
        };
    }]);