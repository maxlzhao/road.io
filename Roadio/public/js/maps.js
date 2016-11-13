var locationsOnPath =[];
var totalDistance = 0; // in meters
var markers=[];
var directionService;
var directionsDisplay;
var map;
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    var style = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#165c64"
            },
            {
                "saturation": 34
            },
            {
                "lightness": -69
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#b7caaa"
            },
            {
                "saturation": -14
            },
            {
                "lightness": -18
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#cbdac1"
            },
            {
                "saturation": -6
            },
            {
                "lightness": -9
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#8d9b83"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -12
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#d4dad0"
            },
            {
                "saturation": -88
            },
            {
                "lightness": 54
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -3
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#bdc5b6"
            },
            {
                "saturation": -89
            },
            {
                "lightness": -26
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#c17118"
            },
            {
                "saturation": 61
            },
            {
                "lightness": -45
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#8ba975"
            },
            {
                "saturation": -46
            },
            {
                "lightness": -28
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#a43218"
            },
            {
                "saturation": 74
            },
            {
                "lightness": -51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#3a3935"
            },
            {
                "saturation": 5
            },
            {
                "lightness": -57
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#cba923"
            },
            {
                "saturation": 50
            },
            {
                "lightness": -46
            },
            {
                "visibility": "on"
            }
        ]
    }
]
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 37, lng: -122},
      styles: style
    });
    var numDays = 5;
    directionsDisplay.setMap(map);
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
                //console.log(route_legs[i])
            }
            return callback(response.routes[0].overview_path)
        }
    })
}
//assume waypoints are latlngs
function updateRoute(source, destination, waypts, callback){
    waypoints=[]
    for(var i=0;i<waypts.length;i++){
        waypoints[i]={location:waypts[i]}
    }
    directionsService.route({
        origin: source,
        destination: destination,
        waypoints: waypoints,
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
            callback(response.routes[0].overview_path);
        }
    })
}

function addPins(pins){
    for(var i=0;i<pins.length;i++){
        var marker = new google.maps.Marker({
            position: {lat: pins[i].lat(),lng:pins[i].lng()},
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
