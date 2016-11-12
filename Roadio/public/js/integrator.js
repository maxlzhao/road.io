// Puts together APIs from maps, hotels, POI, and food to solve the problem

var MILESPERDAY = 100
function solve(A, B, startDate, endDate, keywords) {
    
    findRoute("41325 Kathlean Street", "2119 University Avenue");
    console.log(locationsOnPath)
}

function findRecommendedRoute(A, B, daysAlotted) {
    var daysMinimum = Math.ceil(getTotalDistanceInMiles() / MILESPERDAY)
    var daysFree = daysAlotted - daysMinimum 
    var listOfCords = findRoute(A, B)  
    var POIsToVisit =  getLocationsForWaypoints(listOfCords, ["",""], false).slice(0, daysFree + 1)
    var 
}

