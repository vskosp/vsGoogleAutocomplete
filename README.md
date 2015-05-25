# vsGoogleAutocomplete
Easy autocomplete through the Google Maps JavaScript API v3

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

## Simple usage
1) Add the Google Places library script to your index.html
``` javascript
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
```
2) Add `vs-google-autocomplete.js to` your index.html

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
You can add an options object, which can contain the following properties:
- types `{Array.<string>}` (In general only a single type is allowed): 
  - 'geocode'
  - 'address'
  - 'establishment'
  - '(regions)'
  - '(cities)'
- bounds `{google.maps.LatLngBounds}`
- componentRestrictions `{object}`

For more information look Google Maps JavaScript API [docs](https://developers.google.com/maps/documentation/javascript/places-autocomplete#add_autocomplete).

Example:
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
## Parsing address components
You can bind your model with autocomlete address components. 

Directives for parsing:
- <b>`vs-place`</b> - gets [place detail results](https://developers.google.com/maps/documentation/javascript/places#place_details_results) object
- <b>`vs-place-id`</b> - gets unique identifier denoting place
- <b>`vs-street-number`</b> - gets street number of place
- <b>`vs-street`</b> - gets street name of place
- <b>`vs-city`</b> - gets city name of place
- <b>`vs-state`</b> - gets state name of place
- <b>`vs-country-short`</b> - gets country iso code of place
- <b>`vs-country`</b> - gets country name of place

Example:
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
         
         name="address"
         type="text">
</form>
```
