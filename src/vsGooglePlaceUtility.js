vsGoogleAutocomplete.service('vsGooglePlaceUtility', function() {
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
});