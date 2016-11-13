//API KEY for amadeus linked to abhi's account:
var globalAPIKEY = "1NN8rvmFXgT3rGsfyYfJ9zygeZx1sXoU";
/**
     * Return a list of hotels near a specified location sorted by price.
     * @param {number} latitude - latitude of location, required
     * @param {number} longitude - longitude of location, required
     * @param {number} radius - radius of location, required
     * @param {XXXX-YY-ZZ} check_in - date of check in, must be in formatted as specified and is required
     * @param {number} check_out - date of check out, must be in formatted as specified but is not required
        if you do not provide this, a function will take the day after the check_in day.
     * @param {number} num_results - specify how many hotels in a list you want considering there are more than you want.
     * @return {[{
                    "averageRating" : 0
                    "latitude" : 0,
                    "longitude" : 0,
                    "currency"  : null (String),
                    "daily_rate" : 0,
                    "property_name" : null (String),
                    }
                    .
                    .
                    .
                    ]} List of Hotel dictionary objects
     */
function findHotelsByPrice(latitude, longitude, radius, check_in, check_out, num_results) {
    check_out = check_out || findNextDay(check_in);
	var amadeusURL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=" + latitude + 
	"&longitude=" + longitude + "&radius=" + radius + "&check_in=" + check_in + "&check_out=" + check_out + 
	"&cy=USD&number_of_results=" + num_results + "&apikey=" + globalAPIKEY;
	//console.log(amadeusURL);
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", amadeusURL, true);
    xhReq.onload = function (e) {
        if (xhReq.readyState === 4) {
            if (xhReq.status === 200) {
                console.log(xhReq.responseText);
            } else {
                console.error(xhReq.statusText);
            }
        }
    };
    xhReq.onerror = function (e) {
        console.error(xhReq.statusText);
    };
	xhReq.send(null);
	var jsonObj = JSON.parse(xhReq.responseText);
    //console.log(jsonObj);
    var listOfHotels = [];

    for(hotelNum in jsonObj.results) {
        var hotel = jsonObj.results[hotelNum];
        var averageRating = 0;
        for (awardNum in  hotel["awards"]) {
            var award = hotel["awards"][awardNum];
            //console.log(award["rating"])
            averageRating += award["rating"];
        }
        averageRating = hotel["awards"].length > 0 ? averageRating / hotel["awards"].length : 0;
        var hotelData = { 
            "averageRating" : averageRating,
            //"address" : hotel["address"],
            //"awards" : hotel["awards"],
            //"location" : hotel["location"],
            "latitude" : hotel["location"]["latitude"],
            "longitude" : hotel["location"]["longitude"],
            "currency"  : hotel["min_daily_rate"]["currency"],
            "daily_rate" : hotel["min_daily_rate"]["amount"],
            "property_name" : hotel["property_name"],
        };
        listOfHotels.push(hotelData);
    }
    listOfHotels.sort(function(a,b){return a.daily_rate - b.daily_rate});
    return listOfHotels;
}
/**
     * Return a list of hotels near a specified location sorted by rating.
     * @param {number} latitude - latitude of location, required
     * @param {number} longitude - longitude of location, required
     * @param {number} radius - radius of location, required
     * @param {XXXX-YY-ZZ} check_in - date of check in, must be in formatted as specified and is required
     * @param {number} check_out - date of check out, must be in formatted as specified but is not required
        if you do not provide this, a function will take the day after the check_in day.
     * @param {number} num_results - specify how many hotels in a list you want considering there are more than you want.
     * @return {[{
                    "averageRating" : 0
                    "latitude" : 0,
                    "longitude" : 0,
                    "currency"  : null (String),
                    "daily_rate" : 0,
                    "property_name" : null (String),
                    }
                    .
                    .
                    .
                    ]} List of Hotel dictionary objects
     */
function findHotelsByRating(latitude, longitude, radius, check_in, check_out, num_results) {
    check_out = check_out || findNextDay(check_in);
    var amadeusURL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=" + latitude + 
    "&longitude=" + longitude + "&radius=" + radius + "&check_in=" + check_in + "&check_out=" + check_out + 
    "&cy=USD&number_of_results=" + num_results + "&apikey=" + globalAPIKEY;
    //console.log(amadeusURL);
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", amadeusURL, false);
    xhReq.send(null);
    var jsonObj = JSON.parse(xhReq.responseText);
    //console.log(jsonObj);
    listOfHotels = [];
    for(hotelNum in jsonObj.results) {
        var hotel = jsonObj.results[hotelNum];
        var averageRating = 0;
        for (awardNum in  hotel["awards"]) {
            var award = hotel["awards"][awardNum];
            //console.log(award["rating"])
            averageRating += award["rating"];
        }
        averageRating = hotel["awards"].length > 0 ? averageRating / hotel["awards"].length : 0;
        var hotelData = { 
            "averageRating" : averageRating,
            //"address" : hotel["address"],
            "awards" : hotel["awards"],
            //"location" : hotel["location"],
            "latitude" : hotel["location"]["latitude"],
            "longitude" : hotel["location"]["longitude"],
            "currency"  : hotel["min_daily_rate"]["currency"],
            "daily_rate" : hotel["min_daily_rate"]["amount"],
            "property_name" : hotel["property_name"],
        };
        listOfHotels.push(hotelData);
    }
    listOfHotels.sort(function(a,b){return a.averageRating - b.averageRating});
    listOfHotels.reverse();
    return listOfHotels;
}

/**
     * Return a list of hotels near a specified location sorted by price.
     * @param {[var obj1 = {
                "latitude"  : path[0].lat(),
                "longitude" : path[0].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-13',
                "check_out" : '2016-11-14'
            }
            var obj2 = {
                "latitude"  : path[1].lat(),
                "longitude" : path[1].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-13',
                "check_out" : null
            }
            var obj3 = {
                "latitude"  : path[2].lat(),
                "longitude" : path[2].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-15',
                "check_out" : '2016-11-17'
            }
            var arr = [obj1, obj2, obj3];]]} arr_locations - list of query objects
     * @param {number} num_results - how many results do you want for each query
     * @return {[{
                    "averageRating" : 0
                    "latitude" : 0,
                    "longitude" : 0,
                    "currency"  : null (String),
                    "daily_rate" : 0,
                    "property_name" : null (String),
                    }
                    .
                    .
                    .
                    ]} List of Hotel dictionary objects
     */
function findHotelsGivenManyLocationsByPrice(arr_locations, num_results) {
    listTotal = [];
    for (objNum in arr_locations) {
        var obj = arr_locations[objNum];
        //console.log(obj);
        list = findHotelsByPrice(obj["latitude"], obj["longitude"], obj["radius"], obj["check_in"], obj["check_out"], num_results);
        listTotal = listTotal.concat(list);
    }
    listTotal.sort(function(a,b){return a.daily_rate - b.daily_rate});
    return listTotal;
}

/**
     * Return a list of hotels near a specified location sorted by rating.
     * @param {[var obj1 = {
                "latitude"  : path[0].lat(),
                "longitude" : path[0].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-13',
                "check_out" : '2016-11-14'
            }
            var obj2 = {
                "latitude"  : path[1].lat(),
                "longitude" : path[1].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-13',
                "check_out" : null
            }
            var obj3 = {
                "latitude"  : path[2].lat(),
                "longitude" : path[2].lng(),
                "radius"    : 30,
                "check_in"  : '2016-11-15',
                "check_out" : '2016-11-17'
            }
            var arr = [obj1, obj2, obj3];]]} arr_locations - list of query objects
     * @param {number} num_results - how many results do you want for each query
     * @return {[{
                    "averageRating" : 0
                    "latitude" : 0,
                    "longitude" : 0,
                    "currency"  : null (String),
                    "daily_rate" : 0,
                    "property_name" : null (String),
                    }
                    .
                    .
                    .
                    ]} List of Hotel dictionary objects
     */
function findHotelsGivenManyLocationsByRating(arr_locations, num_results, callback) {
    listTotal = [];
    for (objNum in arr_locations) {
        var obj = arr_locations[objNum];
        //console.log(obj);
        list = findHotelsByRating(obj["latitude"], obj["longitude"], obj["radius"], obj["check_in"], obj["check_out"], num_results);
        listTotal = listTotal.concat(list);
    }
    listTotal.sort(function(a,b){return a.averageRating - b.averageRating});
    listTotal.reverse();
    return callback(listTotal);
}

/**
     * HELPER FUNCTION: Returns next day given a day, used if check out days are not provided
     * @param {XXXX-YY-ZZ} day - given day with specified format, Required
     * @return {XXXX-YY-ZZ} next day
     */
function findNextDay(day) {
    var year = day.substring(0, 4);
    var month = day.substring(5, 7);
    var dayofDay = day.substring(8, 10);
    // console.log(year);
    // console.log(month);
    // console.log(dayofDay);
    var today = new Date(year, month, dayofDay, 0, 0, 0, 0);
    var tomorrow = today;
    tomorrow.setDate(today.getDate() + 1);
    // console.log(tomorrow.getFullYear());
    // console.log(tomorrow.getMonth());
    // console.log(tomorrow.getDate());
    var result = tomorrow.getFullYear() + "-" + tomorrow.getMonth() + "-" + tomorrow.getDate(); 
    return result;  
}
