// Puts together APIs from maps, hotels, POI, and food to solve the problem

var MILES_PER_DAY = 100
var TIME_SPENT_AT_POI = 50 //distance (mi)
function findRecommendedRoute(A, B, daysAlotted) {
    var daysMinimum = Math.ceil(getTotalDistanceInMiles() / MILES_PER_DAY)
    var daysFree = daysAlotted - daysMinimum 
    findRoute(A, B, function(listOfCords){
        console.log(listOfCords)
        getLocationsForWaypoints(listOfCords, ["",""], false,function(POIsToVisit){
            //response must be ordered, currently, simply picking the FIRST few give places close to A
            POIsToVisitSpliced = POIsToVisit.splice(0,daysFree+1)
            updateRoute(A, B, getLatLngs(POIsToVisitSpliced), function(updatedListOfCoords){
                var currDist = 0
                var day_num = 0
                for(var i=0;i<updatedListOfCoords.length-1;i++){
                    currDist+=getDistanceFromLatLonInMi(updatedListOfCoords[i].lat(),getDistanceFromLatLonInM[i].lng(),updatedListOfCoords[i+1].lat(),updatedListOfCoords[i+1].lng();
                    if point is basically at a POI {
                        // we say we are at the POI 
                        currDist += TIME_SPENT_AT_POI
                    }
                    if(currDist > MILES_PER_DAY){
                        currDist=0
                        day_num += 1 
                        //find hotel
                    }
                }
            })
        });
    });
}
function getDistanceFromLatLonInMi(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d*1000*0.000621371;
}

function deg2rad(deg) {
      return deg * (Math.PI/180)
}
function getLatLngs(yelpList, callback){
    var latlngs=[]
    for(var i=0;i < yelpList.length; i++){
        latlngs.push(new google.maps.LatLng(yelpList[i].coordinate.latitude,yelpList[i].coordinate.longitude))
    }
    return latlngs
}

