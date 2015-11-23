# vsGoogleAutocomplete
Angularjs autocomplete module using [Google Maps JavaScript API v3](https://developers.google.com/maps/documentation/javascript/places-autocomplete) and embedded autocomplete validator

- [Demo](#demo)
- [Features](#features)
- [Install](#install)
- [Getting started](#getting-started)
- [Autocomplete options](#autocomplete-options)
- [Parsing address components](#parsing-address-components)
- [Embedded validator](#embedded-validator)
  - [Default usage](#default-usage)
  - [Additional validators](#additional-validators)
  - [Validation errors](#validation-errors)
  - [Custom validators](#custom-validators)
- [Author](#author)
- [License](#license)
- [Credits](#credits)

## Demo
- [Demo](http://plnkr.co/edit/sdcIaQ?p=preview)
- [Demo with validator](http://plnkr.co/edit/u91e8N?p=preview)

## Features
- Has special <b>embedded validator</b> for autocomplete validation
- Can easy <b>parse address components</b> through special directives
- Uses google <b>formatted address</b> as result of autocomplete
- Uses <b>last version</b> of Google Maps JavaScript API (v3)

## Install
#### [Bower](http://bower.io)
```bash
bower install vs-google-autocomplete
```

## Getting started
1) Add the Google Places library script to your index.html
``` javascript
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
```
2) Add `vs-google-autocomplete.js` to your index.html

3) Add `vsGoogleAutocomplete` module dependency:
``` javascript
angular.module('yourApp', ['vsGoogleAutocomplete']);
```
4) Add `vs-google-autocomplete` directive to input field:
``` html
<form>
  <input vs-google-autocomplete
         ng-model="address"
         name="address"
         type="text">
</form>
```

## Autocomplete options
You can add an options object as attribute parameter, which will restrict autocomplete results.

[<b>Options object</b>](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add_autocomplete) can contain the following properties:
- types `{Array.<string>}` (In general only a single type is allowed): 
  - 'geocode'
  - 'address'
  - 'establishment'
  - '(regions)'
  - '(cities)'
- bounds `{google.maps.LatLngBounds}`
- componentRestrictions `{object}`

<b>Example</b>:
``` html
<form>
  <input vs-google-autocomplete="options"
         ng-model="address"
         name="address"
         type="text">
</form>
```
```javascript
$scope.options = {
  types: ['(cities)'],
  componentRestrictions: { country: 'FR' }
}
```
In example above, autocomplete results will only consist of cities of France.

## Parsing address components
You can bind your model with autocomplete address components. 

<b>Directives for parsing</b>:
- <b>`vs-place`</b> - gets [place detail results](https://developers.google.com/maps/documentation/javascript/places#place_details_results) object
- <b>`vs-place-id`</b> - gets unique identifier denoting place
- <b>`vs-street-number`</b> - gets street number of place
- <b>`vs-street`</b> - gets street name of place
- <b>`vs-city`</b> - gets city name of place
- <b>`vs-state`</b> - gets state name of place
- <b>`vs-country-short`</b> - gets country iso code of place
- <b>`vs-country`</b> - gets country name of place
- <b>`vs-latitude`</b> - gets latitude of place
- <b>`vs-longitude`</b> - gets longitude of place
- <b>`vs-post-code`</b> - gets postcode of place
- <b>`vs-district`</b> - gets district of place (administrative_area_level_2)

<b>Example</b>:
``` html
<form>
  <input vs-google-autocomplete="options"
         ng-model="address.name"
         
         vs-place="address.place" 
         vs-place-id="address.components.placeId"
         vs-street-number="address.components.streetNumber" 
         vs-street="address.components.street"
         vs-city="address.components.city"
         vs-state="address.components.state"
         vs-country-short="address.components.countryCode"
         vs-country="address.components.country"
	     vs-district = "address.components.district"
         
         name="address"
         type="text">
</form>
```

## Embedded validator
Module, as an addition, also provides special validator for autocomplete validation.

### Default usage
1) Add `vs-autocomplete-validator.js` to your index.html

2) Add `vs-autocomplete-validator` directive to input field:
``` html
<form>
  <input vs-google-autocomplete
         vs-autocomplete-validator
         ng-model="address"
         name="address"
         type="text">
</form>
```
By default, validator checks if autocomplete result is a valid google address (selected from drop down list).

### Additional validators
You can add additional validator by adding denormalized validator name as attribute parameter. If you need more than one additional validator, you can add validator names using comma(`,`) separator.

Validator names in html are normalized in javascript code, so validator with name `vsStreetAddress` should have name `vs-street-address` in html.

<b>Available validator names</b>
- <b>`vsStreetAddress`</b> - normalized name of validator, which checks if autocomplete result is full address (street number, street, ...)

This module is under development and now it has only one additional validator (and one by default). Please, if you need other additional validators, you can write about this in [issues](https://github.com/vskosp/vsGoogleAutocomplete/issues), we will be grateful to you :).

<b>Example</b>
``` html
<form>
  <input vs-google-autocomplete
         vs-autocomplete-validator="vs-street-address"
         ng-model="address"
         name="address"
         type="text">
</form>
```
In the example above validator will checks if autocomplete result is a valid google address <b>and</b> if it is a full address (street number, street, ...).

### Validation errors
Validator publishes validation errors if validation is failed.

If validation is failed, validator publish error with name `vsAutocompleteValidator` to `NgModelController.$error` hash object <b>and</b> name of each embedded validator to `NgModelController.vsAutocompleteErorr` hash object.

### Custom validators
You can also add your own validator for your own needs. Embedded validator should validate [PlaceResult](https://developers.google.com/maps/documentation/javascript/places#place_details_results) object, which returns after autocomplete. For this, you should add factory to your main module, which must return function.

<b>Custom validator template</b>:
```javascript
angular.module('yourApp')
  .factory('validatorName', function() {
    /**
    * Implementation of custom embedded validator.
    * @param {google.maps.places.PlaceResult} PlaceResult object.
    * @return {boolean} Valid status (true or false)
    */
    function validate(place) {
    	// ...
    }
    	
    return validate;
  });
```
<b>Rules for custom validator</b>:
- you should add factory to any module of your app
- factory must always return function (embedded validator implementation)
- function for validation always gets [PlaceResult](https://developers.google.com/maps/documentation/javascript/places#place_details_results) object as parameter
- you should implement function, which returns
- factory name - it is normalized embedded validator name (eg. 'validatorName' in factory can be 'validator-name' in html)

After adding custom validator, you should add its name as attribute parameter to `vs-autocomplete-validator` directive. Validator with name `someValidatorName` in factory should have name `some-validator-name` in html.

Core developers can inject in validator factory `vsGooglePlaceUtility`service, which contains useful functionality for working with `PlaceResult` object (parameter of function for validation). You can look at this utility service in `vs-autocomplete-validator.js` :).

## Author
**K.Polishchuk** (http://github.com/vskosp)

## License
[MIT](http://opensource.org/licenses/MIT) © K.Polishchuk

## Credits
Google Maps JavaScript API https://developers.google.com/maps/documentation/javascript/places-autocomplete
