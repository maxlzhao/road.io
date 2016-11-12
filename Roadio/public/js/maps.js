var locationsOnPath =[];
var totalDistance = 0; // in meters
var markers=[];
var directionService;
var directionsDisplay;
var map;
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 37, lng: -122}
    });
    var numDays = 5;

    directionsDisplay.setMap(map);
    var A = "2227 Piedmont Avenue"
    var B = "100 Universal City Plaza, Universal City"
    var currentPos;
    locationsOnPath = findRoute(A, B);
    waypts=[]
    pins=[]
}
document.body.addEventListener("click", function(){
    console.log(locationsOnPath)
    console.log(totalDistance)
});

function getTotalDistanceInMiles(){
    return totalDistance*0.000621371
}

function findRoute(source, destination){
    directionsService.route({
        origin: source,
        destination: destination,
        travelMode: "DRIVING"
    }, function(response, status){
        if(status == "OK"){
            directionsDisplay.setDirections(response);
            locationsOnPath = response.routes[0].overview_path;
            route_legs=response.routes[0].legs
            totalDistance = 0;
            for(var i=0;i<route_legs.length;i++){
                totalDistance += route_legs[i].distance.value
                console.log(route_legs[i])
            }
            return response.routes[0].overview_path
        }
    })

}

function updateRoute(map, directionsService,directionsDisplay, numDays, geocoder, source, destination, waypts){
    directionsService.route({
        origin: source,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: "DRIVING"
    }, function(response, status){
        if(status == "OK"){
            directionsDisplay.setDirections(response);
            route_legs=response.routes[0].legs
            totalDistance = 0;
            for(var i=0;i<route_legs.length;i++){
                totalDistance += route_legs[i].distance.value
                console.log(route_legs[i])
            }
            return response.routes[0].overview_path;
        }
    })
    
}

function addPins(map,pins,label){
    for(var i=0;i<pins.length;i++){
        var marker = new google.maps.Marker({
            position: {lat: pins[i].lat(),lng:pins[i].lng()},
        });
        markers.push(marker)
    }
}

function showPins(map){
    for(var i=0;i<markers.length;i++){
        markers[i].setMap(map)
    }
}

function clearPins(markers){
    for(var i=0;i<markers.length;i++){
        markers[i].setMap(null)
    }
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
