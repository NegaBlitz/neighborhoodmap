//Combines app and map together.

//A JSON string of the locations

//Contains an escaped version of: 
// [
	// {title: 'Little Caesers', location: {lat: 35.6593, lng: -81.2289}},
	// {title: 'Western Steer', location: {lat: 35.6589, lng: -81.2306}},
	// {title: 'Blue Moon', location: {lat: 35.6637, lng: -81.2224}},
	// {title: 'Pin Station', location: {lat: 35.6629, lng: -81.2297}},
	// {title: 'South Newton Elementary', location: {lat: 35.6543, lng: -81.2288}}
// ]
var JSONplaces = "[\r\n   {\r\n      \"title\": \"Little Caesers\",\r\n      \"location\": {\r\n         \"lat\": 35.6593,\r\n         \"lng\": -81.2289\r\n      }\r\n   },\r\n   {\r\n      \"title\": \"Western Steer\",\r\n      \"location\": {\r\n         \"lat\": 35.6589,\r\n         \"lng\": -81.2306\r\n      }\r\n   },\r\n   {\r\n      \"title\": \"Blue Moon\",\r\n      \"location\": {\r\n         \"lat\": 35.6637,\r\n         \"lng\": -81.2224\r\n      }\r\n   },\r\n   {\r\n      \"title\": \"Pin Station\",\r\n      \"location\": {\r\n         \"lat\": 35.6629,\r\n         \"lng\": -81.2297\r\n      }\r\n   },\r\n   {\r\n      \"title\": \"South Newton Elementary\",\r\n      \"location\": {\r\n         \"lat\": 35.6543,\r\n         \"lng\": -81.2288\r\n      }\r\n   }\r\n]";

//Parse the objects
var locations = ko.utils.parseJson(JSONplaces);

// Map variable
var map;

// Create a new blank array for all of the markers.
var markers = [];

//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//

//Initialize the map
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.658424, lng: -81.235107},
		zoom: 14,
		streetViewControl: false,
		mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
    }
	});
	
	var largeInfowindow = new google.maps.InfoWindow();
	
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('C16AD7');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('48BDF7');
	
	var bounds = new google.maps.LatLngBounds();
	
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
		bounds.extend(markers[i].position);
	}

	// Extend the boundaries of the map for each marker
	map.fitBounds(bounds);
}

//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//

// Knockout 'place' objects for the map's locations
function Place(title, location) {
	this.title = ko.observable(title);
	this.location = ko.observableArray([]);
}

// Maps everything in the locations array
var mappedData = ko.utils.arrayMap(locations, function(place) {
    return new Place(place.title, place.location);
});

// The viewmodel
var viewModel = {
	//Initially populate places
	places: ko.observableArray([]),
	filter: ko.observable("")
	//marker?
};

// Filter the viewmodel
viewModel.filteredPlaces = ko.dependentObservable(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.places();
    } else {
        return ko.utils.arrayFilter(this.places(), function(place) {
            return place.title().toLowerCase().indexOf(filter) !== -1;
        });
    }
}, viewModel);

viewModel.places(mappedData);

$(document).ready(function() {
    ko.applyBindings(viewModel);
});

//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//




// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
}

// This function will make markers vanish, and then reappear if they do not get filtered out.
function updateMarkers(){
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	
	viewModel.filteredPlaces().forEach(function(place){
		console.log(viewModel.filteredPlaces().length);
	});
}