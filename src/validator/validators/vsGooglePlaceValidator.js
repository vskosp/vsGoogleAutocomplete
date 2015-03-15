vsGoogleAutocomplete.factory('vsGooglePlace', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
    function validator(place) {
		return vsGooglePlaceUtility.isGooglePlace(place);
	}
	
	return {
	    validator: validator
	};
}]);