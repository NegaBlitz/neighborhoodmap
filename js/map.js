function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 35.658424, lng: -81.235107},
		zoom: 16,
		mapTypeControl: false
	});
}