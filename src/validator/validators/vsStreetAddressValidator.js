vsGoogleAutocomplete.factory('vsStreetAddress', ['vsGooglePlaceUtility', function(vsGooglePlaceUtility) {
    var PLACE_TYPES = ["street_address", "premise"];	

	function validator(place) {
		return vsGooglePlaceUtility.isContainTypes(place, PLACE_TYPES);
	}
	
	return {
	    validator: validator
	};
}]);