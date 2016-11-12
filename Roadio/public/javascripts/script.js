function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 37, lng: -122}
    });
    var numDays = 5;

    directionsDisplay.setMap(map);
    
    var currentPos;
    calculateAndDisplayRoute(map, directionsService,directionsDisplay, numDays, geocoder, "2227 Piedmont Avenue","100 Universal City Plaza, Universal City");
}

function calculateAndDisplayRoute(map, directionsService,directionsDisplay, numDays, geocoder, source, destination){
    /*geocoder.geocode({'address':destination}, function(results,status){
        if(status == "OK"){
            result= results[0]
            destination=results[0].geometry.location
        }
    })
    */
    directionsService.route({
        origin: source,
        destination: destination,
        travelMode: "DRIVING"
    }, function(response, status){
        if(status == "OK"){
            directionsDisplay.setDirections(response);
            var totalDistance = 0;
            legs = response.routes[0].legs;  
            for(var i=0;i<legs.length;i++){
                totalDistance += legs[i].distance.value
            }
            console.log(numDays)
            console.log(totalDistance/numDays);
            var path = response.routes[0].overview_path
            var hotelDist=0
            for(var i=0;i<path.length;i+=2){
                hotelDist += getDistanceFromLatLonInM(path[i].lat(),path[i].lng(),path[i+2].lat(),path[i+2].lng())
                //console.log(hotelDist)
                if(hotelDist > totalDistance/numDays){
                    console.log(returnHotels(path[i].lat(),path[i].lng(),30, '2016-11-13', '2016-11-14'));
                    var marker = new google.maps.Marker({
                        position: path[i],
                        map: map,
                        title: 'Hotel near here'
                    });
                    hotelDist = 0
                }
            }
        }
    })

}

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d*1000;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function returnHotels(latitude, longitude, radius, check_in, check_out) {
	var amadeusURL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=" + latitude + 
	"&longitude=" + longitude + "&radius=" + radius + "&check_in=" + check_in + "&check_out=" + check_out + 
	"&cy=USD&number_of_results=10&apikey=1NN8rvmFXgT3rGsfyYfJ9zygeZx1sXoU";
	console.log(amadeusURL);
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", amadeusURL, false);
	xhReq.send(null);
	return JSON.parse(xhReq.responseText);
}
/*function getCurrentPosition(callback){
    console.log("getting current pos")
    var currentPosition;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            currentPosition = currentPos;
            console.log("got current pos")
            return callback(currentPosition)
        }); 
    } else {
        currentPosition = null
        console.log("No geolocation :(")
        return callback(currentPosition)
    }
}*/