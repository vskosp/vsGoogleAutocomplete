/** validatorsHash example: 
*  [{
*      name: 'validatorName2',
*  	validate: 'injectedFunc2'
*  },{
*      name: 'validatorName3',
*  	validate: 'injectedFunc3'
*  }];
*/
vsGoogleAutocomplete.factory('vsValidatorsInjector', ['$injector', function($injector) {
	var validatorsHash = [];
	
	function createValidator(validatorName) {
	    var validator = {};
		validator.name = validatorName;
		validator.validate = $injector.get(validatorName).validator;
		return validator;
	}
	
	function searchValidator(validatorName) {
	    for (var i = 0; i < validatorsHash.length; i++) {
		    if(validatorsHash[i].name === validatorName)
			    return validatorsHash[i];
		}
		return;
	}
	
	function injectValidator(validatorName) {
	    var validator = searchValidator(validatorName);
		if(!validator) {
		    validator = createValidator(validatorName);
			validatorsHash.push(validator);
		}				
		return validator;
	}
	
	 function injectValidators(validatorsNamesList) {
	    var validatorsList = [];
		for (var i = 0; i < validatorsNamesList.length; i++) {
		    var validator = injectValidator(validatorsNamesList[i]);
			validatorsList.push(validator);
		}
		return validatorsList;
	}
	
	return {
	    injectValidators: injectValidators
	};
}]);