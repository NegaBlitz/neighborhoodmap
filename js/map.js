var map;

// Create a new blank array for all the listing markers.
var markers = [];

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

	// These are the locations of the stuff in my hometown.
	var locations = [
		{title: 'Little Caesers', location: {lat: 35.6593, lng: -81.2289}},
		{title: 'Western Steer', location: {lat: 35.6589, lng: -81.2306}},
		{title: 'Blue Moon', location: {lat: 35.6637, lng: -81.2224}},
		{title: 'Pin Station', location: {lat: 35.6629, lng: -81.2297}},
		{title: 'South Newton Elementary', location: {lat: 35.6543, lng: -81.2288}}
	];

	var largeInfowindow = new google.maps.InfoWindow();
	
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('C16AD7');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('48BDF7');
	
	var bounds = new google.maps.LatLngBounds();

	// The following group uses the location array to create an array of markers on initialize.
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

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
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