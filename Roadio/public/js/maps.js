var locationsOnPath =[];
var totalDistance = 0; // in meters
var markers=[];
var directionsService=[];
var directionsDisplay=[];
var map;
function initMap() {
    directionsService.push(new google.maps.DirectionsService);
    directionsDisplay.push(new google.maps.DirectionsRenderer);
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 37, lng: -122}
    });
    var numDays = 5;
    directionsDisplay[0].setMap(map);
    var url = window.location.href 
    var urlParams = parseURLParams(url)
    var A = urlParams["startLocation"][0]
    var B = urlParams["endLocation"][0]
    var currentPos;
    locationsOnPath = findRoute(A, B,function(bl){});
    waypts=[]
    pins=[]
}
/*document.body.addEventListener("click", function(){
    console.log(locationsOnPath)
    console.log(totalDistance)
});
*/

function getTotalDistanceInMiles(){
    return totalDistance*0.000621371
}

function findRoute(source, destination, callback){
    directionsService=[]
    directionsDisplay=[]
    directionsService.push(new google.maps.DirectionsService)
    directionsDisplay.push(new google.maps.DirectionsRenderer)
    directionsDisplay[0].setMap(map)
    directionsService[0].route({
        origin: source,
        destination: destination,
        travelMode: "DRIVING"
    }, function(response, status){
        if(status == "OK"){
            directionsDisplay[0].setDirections(response);
            locationsOnPath = response.routes[0].overview_path;
            route_legs=response.routes[0].legs
            totalDistance = 0;
            for(var i=0;i<route_legs.length;i++){
                totalDistance += route_legs[i].distance.value
                //console.log(route_legs[i])
            }
            return callback(response.routes[0].overview_path)
        }
    })
}
//assume waypoints are latlngs
function updateRoute(source, destination, waypts, callback){
    //addPins(waypts)
    clearDisplay(directionsDisplay)
    waypoints=[]
    directionsService=[]
    directionsDisplay=[]
    for(var i=0;i<waypts.length;i++){
        waypoints.push({location: new google.maps.LatLng(waypts[i].lat,waypts[i].lng)})
    }
    currIndex=0
    for(var i=0;i<waypoints.length;i+=7){
        directionsService.push(new google.maps.DirectionsService)
        directionsDisplay.push(new google.maps.DirectionsRenderer)
        var src;
        var dest;
        if(i == 0){
            src=source
        }else{
            src=waypoints[i]
        }
        if(i+7 > waypoints.length){
            dest=destination
        }else{
            dest=waypoints[i+7]
        }
        console.log(src)
        console.log(dest)
        directionsService[currIndex].route({
            origin:src,
            destination:dest,
            waypoints:waypoints.slice(i,i+7),
            optimizeWaypoints: true,
            travelMode: "DRIVING"
        },function(response,status){
            console.log(status)
            if(status == "OK"){
                directionsDisplay[currIndex].setMap(map)
                directionsDisplay[currIndex].setDirections(response)
                console.log(directionsDisplay[currIndex])
                currIndex+=1
            }
        })
    }
}
function clearDisplay(directionsDisplay){
    for(var i=0;i<directionsDisplay.length;i++){
        directionsDisplay[i].setMap(null)
    }
}

function addPins(pins){
    for(var i=0;i<pins.length;i++){
        var marker = new google.maps.Marker({
            position: {lat: pins[i].lat,lng:pins[i].lng},
        });
        markers.push(marker)
    }
    showPins()
}

function showPins(){
    for(var i=0;i<markers.length;i++){
        markers[i].setMap(map)
    }
}

function clearPins(){
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


function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
function convertDateFormat(date) {
    var dateArr = date.split("%2F")
    var ret = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1]
    return ret
}
