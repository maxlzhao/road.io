// Puts together APIs from maps, hotels, POI, and food to solve the problem

var mapsAPI = require("maps.js");
var hotelsAPI = require("hotels.js");
var yelpAPI = require("yelp.js");

function solve(A, B, startDate, endDate, keywords) {
    var pointsOnRoute = mapsAPI.findRoute(A, B);
    var pois = yelpAPI.findPOIonPath(pointsOnRoute);
    var hotels = mapsAPI.findHotels();
    

}


