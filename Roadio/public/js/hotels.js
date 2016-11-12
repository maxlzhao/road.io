function findHotelsByPrice(latitude, longitude, radius, check_in, check_out, num_results) {
    check_out = check_out || findNextDay(check_in);
	var amadeusURL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=" + latitude + 
	"&longitude=" + longitude + "&radius=" + radius + "&check_in=" + check_in + "&check_out=" + check_out + 
	"&cy=USD&number_of_results=" + num_results + "&apikey=1NN8rvmFXgT3rGsfyYfJ9zygeZx1sXoU";
	//console.log(amadeusURL);
	var xhReq = new XMLHttpRequest();
	xhReq.open("GET", amadeusURL, false);
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

function findHotelsByRating(latitude, longitude, radius, check_in, check_out, num_results) {
    check_out = check_out || findNextDay(check_in);
    var amadeusURL = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?latitude=" + latitude + 
    "&longitude=" + longitude + "&radius=" + radius + "&check_in=" + check_in + "&check_out=" + check_out + 
    "&cy=USD&number_of_results=" + num_results + "&apikey=1NN8rvmFXgT3rGsfyYfJ9zygeZx1sXoU";
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
    listOfHotels.sort(function(a,b){return a.averageRating - b.averageRating});
    listOfHotels.reverse();
    return listOfHotels;
}

function findHotelsGivenManyLocationsByPrice(arr_locations) {
    listTotal = [];
    for (objNum in arr_locations) {
        var obj = arr_locations[objNum];
        //console.log(obj);
        list = findHotelsByPrice(obj["latitude"], obj["longitude"], obj["radius"], obj["check_in"], obj["check_out"], 10);
        listTotal = listTotal.concat(list);
    }
    listTotal.sort(function(a,b){return a.daily_rate - b.daily_rate});
    return listTotal;
}

function findHotelsGivenManyLocationsByRating(arr_locations) {
    listTotal = [];
    for (objNum in arr_locations) {
        var obj = arr_locations[objNum];
        //console.log(obj);
        list = findHotelsByPrice(obj["latitude"], obj["longitude"], obj["radius"], obj["check_in"], obj["check_out"], 10);
        listTotal = listTotal.concat(list);
    }
    listTotal.sort(function(a,b){return a.averageRating - b.averageRating});
    listTotal.reverse();
    return listTotal;
}

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