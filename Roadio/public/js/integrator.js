// Puts together APIs from maps, hotels, POI, and food to solve the problem

var MILES_PER_DAY = 200
var TIME_SPENT_AT_POI = 200 //distance (mi)
/*
function findRecommendedRoute(A, B, daysAlotted) {
    findRoute(A, B, function(listOfCords){
        var daysMinimum = Math.ceil(getTotalDistanceInMiles() / MILES_PER_DAY)
        var daysFree = daysAlotted - daysMinimum 
        getLocationsForWaypoints(listOfCords, ["",""], false,function(POIsToVisit){
            //response must be ordered, currently, simply picking the FIRST few give places close to A
            console.log(daysFree)
            POIsToVisitSpliced = POIsToVisit.splice(0,daysFree+1)
            console.log(POIsToVisitSpliced)
            updateRoute(A, B, getLatLngs(POIsToVisitSpliced), function(updatedListOfCoords){
                var currDist = 0
                var day_num = 0
                var poi_num=0
                var hotel_places=[]
                var latLngsPOIs=getLatLngs(POIsToVisitSpliced)
                console.log(latLngsPOIs)

                for(var i=0;i<updatedListOfCoords.length-1;i++){
                    currDist+=getDistanceFromLatLonInMi(updatedListOfCoords[i].lat(),updatedListOfCoords[i].lng(),updatedListOfCoords[i+1].lat(),updatedListOfCoords[i+1].lng());
                    if(!poi_num > latLngsPOIs.length && getDistanceFromLatLonInMi(updatedListOfCoords[i].lat(),updatedListOfCoords[i].lng(),latLngsPOIs[poi_num].lat(),latLngsPOIs[poi_num].lng()) < 20){
                        // we say we are at the POI 
                        poi_num += 1
                        currDist += TIME_SPENT_AT_POI
                    }
                    if(currDist > MILES_PER_DAY){
                        currDist=0
                        day_num += 1 
                        hotel_places.push(updatedListOfCoords[i])//find hotel
                    }
                }
                //addPins(hotel_places)
                var hotelQuery=[]
                for(var i=0;i<hotel_places.length;i++){
                    var bl={}
                    bl["latitude"]=hotel_places[i].lat();
                    bl["longitude"]=hotel_places[i].lng();
                    bl["radius"]=30;
                    bl["check_in"]="2016-11-12"
                    bl["check_out"]="2016-11-13"
                    hotelQuery.push(bl)   
                }
                findHotelsGivenManyLocationsByRating(hotelQuery,10, function(hotels){
                    var chosenHotelsLocation=[]
                    for(var i=0;i<hotels.length;i++){
                        if(hotels[i].length > 0){
                            chosenHotelsLocation.push(new google.maps.LatLng(hotels[i][0].latitude,hotels[i][0].longitude))
                        }
                    }
                    addPins(chosenHotelsLocation)
                    allLocations=[]
                    for(var i=0;i<chosenHotelsLocation.length;i+=1){
                        allLocations.push(chosenHotelsLocation[i])
                    }
                    for(var i=0;i<latLngsPOIs.length;i++){
                        allLocations.push(latLngsPOIs[i])
                    }
                    updateRoute(A,B,allLocations)
                    console.log("done")
                });

            });
        });
    });
}
*/
function potentialPOIsFreeDays(A,B,daysAlotted,keywords,callback){
    findRoute(A,B, function(listOfCoords){
        var daysMinimum = Math.ceil(getTotalDistanceInMiles() / MILES_PER_DAY)
        var daysFree = daysAlotted - daysMinimum 
        console.log(daysMinimum)
        console.log(daysFree)
        var POIs=[]
        getLocationsForWaypoints(listOfCoords,keywords,false, function(potentialPOIs){
            POIs=potentialPOIs
            callback(POIs, daysFree)
        });
    })
}
function potentialHotels(A,B,startDate,daysAllotted,callback){
    console.log(startDate)
    findRoute(A,B,function(listOfCoords){
        var hotel_days=[]
        var hotel_search_places=[]
        var hotelQuery=[]
        var currDist=0
        getHotelSearchPlaces(listOfCoords, startDate, function(hotel_search_places,hotel_days){
            for(var i=0;i<hotel_search_places.length;i++){
                var bl={}
                bl["latitude"]=hotel_search_places[i].lat();
                bl["longitude"]=hotel_search_places[i].lng();
                bl["radius"]=30;
                bl["check_in"]=hotel_days[i];
                bl["check_out"]=findNextDay(hotel_days[i]);
                hotelQuery.push(bl);
                console.log(hotelQuery)
            }
            findHotelsGivenManyLocationsByRating(hotelQuery,5,function(list_of_lists_hotels){
                callback(list_of_lists_hotels)
            });
        });
    });
}
function getHotelSearchPlaces(listOfCoords,currentDay,callback){
    var currDist=0
    var hotel_search_places=[]
    var hotel_days=[]
    for(var i=0;i<listOfCoords.length-1;i++){
        currDist+=getDistanceFromLatLonInMi(listOfCoords[i].lat(),listOfCoords[i].lng(),listOfCoords[i+1].lat(),listOfCoords[i+1].lng());
        if(currDist > MILES_PER_DAY){
            currDist=0
            hotel_days.push(currentDay)
            currentDay = findNextDay(currentDay)
            hotel_search_places.push(listOfCoords[i])//find hotel
        }
        if(i==listOfCoords.length-2){
            callback(hotel_search_places,hotel_days)
        }
    }
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
function findNextDay(day) {
    var year = day.substring(0, 4);
    var month = day.substring(5, 7);
    var dayofDay = day.substring(8, 10);
                    // console.log(year);
                    //     // console.log(month);
                    //         // console.log(dayofDay);
    var today = new Date(year, month, dayofDay, 0, 0, 0, 0);
    var tomorrow = today;
    tomorrow.setDate(today.getDate() + 1);
                    //                         // console.log(tomorrow.getFullYear());
                    //                             // console.log(tomorrow.getMonth());
                    //                                 // console.log(tomorrow.getDate());
    var result = tomorrow.getFullYear() + "-" + tomorrow.getMonth() + "-" + tomorrow.getDate(); 
    return result;  
}
