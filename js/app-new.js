//Combines app and map together.

//A JSON string of the locations

//Contains an escaped version of: 

//var JSONplaces = "[\r\n\t{title: 'Little Caesers', location: {lat: 35.6593, lng: -81.2289}, id: 0},\r\n\t{title: 'Western Steer', location: {lat: 35.6589, lng: -81.2306}, id: 1},\r\n\t{title: 'Blue Moon', location: {lat: 35.6637, lng: -81.2224}, id: 2},\r\n\t{title: 'Pin Station', location: {lat: 35.6629, lng: -81.2297}, id: 3},\r\n\t{title: 'South Newton Elementary', location: {lat: 35.6543, lng: -81.2288}, id: 4}\r\n]";

//Parse the objects
var locations = [
	{title: 'Domino\'s Pizza', location: {lat: 35.307246, lng: -80.720780}, id: 0},
	{title: 'Wendy\'s', location: {lat: 35.311833, lng: -80.713044}, id: 1},
	{title: 'UNC Charlotte', location: {lat: 35.307093, lng: -80.735164}, id: 2},
	{title: 'O\'Charley\'s', location: {lat: 35.295793, lng: -80.741680}, id: 3},
	{title: 'Bojangle\'s', location: {lat: 35.305390, lng: -80.733129}, id: 4},
];

// Map variable
var map = "None";

// Create a new blank array for all of the markers.
var markers = [];

//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//
//***************************************************************************//

//Highlighted marker icons
var defaultIcon;
var highlightedIcon;
var largeInfowindow;

//Initialize the map
function initMap() {
	
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.307093, lng: -80.735164},
		zoom: 14,
		streetViewControl: false,
		mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
    }
	});
	
	
	
	largeInfowindow = new google.maps.InfoWindow();
	
	// Style the markers a bit. This will be our listing marker icon.
	defaultIcon = makeMarkerIcon('C16AD7');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	highlightedIcon = makeMarkerIcon('48BDF7');
	
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
			
			// Unhighlights everything else
				for (var i = 0; i < markers.length; i++) {
				markers[i].setIcon(defaultIcon);
			}
			
			// Animates on click
			animateMarker(this);
			
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
function Place(title, location, id) {
	this.title = ko.observable(title);
	this.location = location;
	this.id = id;
}

// Maps everything in the locations array
var mappedData = ko.utils.arrayMap(locations, function(place) {
    return new Place(place.title, place.location, place.id);
});

// The viewmodel
var viewModel = {
	//Initially populate places
	places: ko.observableArray([]),
	filter: ko.observable("")
};

// Filter the viewmodel
viewModel.filteredPlaces = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.places();
    } else {
        return ko.utils.arrayFilter(this.places(), function(place) {
            return place.title().toLowerCase().indexOf(filter) !== -1;
        });
    }
}, viewModel);

//Highlights the marker of the place selected, and pops the infowindow open
viewModel.highlightMarker = function() {
	animateMarker(markers[this.id]);
};


//Should change markers when input changes
viewModel.filter.subscribe(function(newValue) {

	//Calls the update marker function
	updateMarkers();
});


//Animates marker when clicked on
function animateMarker(m) {
	//Bounce this marker once and stop it after a timeout
	
	//Stop other markers
	for (var i = 0; i < markers.length; i++) {
		markers[i].setAnimation(null);
	}
	
	//Stop timeout from being called again at the wrong time
	clearTimeout(animationTimeout);
	
	//Animate THIS MARKER
	m.setAnimation(google.maps.Animation.BOUNCE);
	
	//Stop this marker after a timeout
	stopAnimation(m);
	
	//Pop the infowindow out for this marker
	populateInfoWindow(m, largeInfowindow);
};

var animationTimeout;

function stopAnimation(marker) {
    animationTimeout = setTimeout(function () {
        marker.setAnimation(null);
    }, 750);
}

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

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {

		//Prevents info from previously activated marker from appearing
		infowindow.setContent('');
		
		//Gets the marker passed
		infowindow.marker = marker;
		
		//Pan to marker
		map.panTo(marker.getPosition());
		
		//Initialize the infowindow's information
		var infowindowString = '<h4>' + marker.title + ' recent news via New York Times</h4>';
		
		var timesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + marker.title + "&sort=newest&api-key=fe1ff80db0e14c8bbd2765eaa23f925c";
		
		$.getJSON(timesUrl, function( data ) {
			
			articles = data.response.docs;
			
			while(articles.length > 5) {
				articles.pop();
			}
			
			for(var i = 0; i < articles.length; i++) {
				var article = articles[i];
				infowindowString = infowindowString.concat('<li class="article">' +
					'<a href ="' + article.web_url + '">' + article.headline.main+'</a>'+'</li>');
				// console.log(infowindowString);
			};
			infowindow.setContent(infowindowString);
		}).fail(function(e) {
			infowindow.setContent(infowindowString + 'New York Times articles could not be loaded');
		});
		
		infowindow.open(map, marker);
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick',function(){
			infowindow.setMarker = null;
		});
	}
}

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
			// console.log(place);
			// console.log(place.id);
			markers[place.id].setMap(map);
		});
}

//Checks if the map is actually visible (Error Handling)
function mapError(){
		alert("The map didn't load! Refresh and check for errors!");
}