vsGoogleAutocomplete.service('vsValidator', ['vsValidatorsInjector', function(vsValidatorsInjector) {
    var IMBEDDED_VALIDATORS_NAMES_LIST = ['vsGooglePlace'];
	
	function Validator(modelController, validatorsNamesList) {
	    validatorsNamesList = IMBEDDED_VALIDATORS_NAMES_LIST.concat(validatorsNamesList);
		this.modelController = modelController;
	    this.validators = vsValidatorsInjector.injectValidators(validatorsNamesList);  //Array[]
	}
	Validator.prototype.validate = function(place) {    			
	    for (var validatorIdx = 0; validatorIdx < this.validators.length; validatorIdx++) {
		    var validator = this.validators[validatorIdx],
			    result = validator.validate(place),
			    error = validator.name;
			this.modelController.$setValidity(error, result);
		}
	};
	Validator.prototype.enable = function(scope) {
	    var PLACE_DETAILS_CONTAINER = 'vsPlaceDetails',
		    self = this;
	    scope.$watch(function() { 
		    return scope[PLACE_DETAILS_CONTAINER]; 
		}, function(place) {
			self.validate(place);
		});
	};
		
	this.create = function(modelController, validatorsNamesList) {
	    var validator = new Validator(modelController, validatorsNamesList);
		return validator;
	};
}]);