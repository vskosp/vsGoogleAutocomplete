vsGoogleAutocomplete.directive('vsGoogleValidator', ['vsValidator', function(vsValidator) {
	return {
	    restrict: 'A',
		require: ['ngModel', 'vsGoogleAutocomplete'],
		link: function(scope, element, attrs, controllers) {
		    var modelController = controllers[0],
		        autocompleteController = controllers[1],
		        validatorsNames = attrs.vsGoogleValidator,
		        validatorsNamesList = (validatorsNames!=="") ? validatorsNames.trim().split(',') : [],
				validator = vsValidator.create(modelController, validatorsNamesList),
			    autocompleteIsolatedScope = autocompleteController.services.isolatedScope;
			
			validator.enable(autocompleteIsolatedScope);
		}
	};
}]);