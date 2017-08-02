function Place(title, location) {
	this.title = ko.observable(title);
	this.location = ko.observableArray([]);
}

var viewModel = {
	//Initially populate places
	places: ko.observableArray([]),
	filter: ko.observable("")
	//marker?
};

//ko.utils.arrayFilter - filter places using the filter text
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
var locData = ko.utils.parseJson(JSONplaces);

console.log(locData);

//Maps the data
var mappedData = ko.utils.arrayMap(locData, function(place) {
    return new Place(place.title, place.location);
});

viewModel.places(mappedData);

$(document).ready(function() {
    ko.applyBindings(viewModel);
});

console.log(viewModel.places());

// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locData.length; i++) {
	// Get the position from the location array.
	var position = locData[i].location;
	var title = locData[i].title;
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



	