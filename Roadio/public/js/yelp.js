// Note: need to import these in html file!!!
//
// <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
// <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/OAuth.js"></script>
// <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/SHA1.js"></script>

// Debugging purposes only
var test_list = [{lat : 37.8719,
              lng : -122.2585},
             {lat : 32.8801,
              lng : -117.2340},
             {lat : 32.8801,
              lng : -117.2340}]


// Global constants

var auth = {
    consumerKey : "NP1wcdFPMAvBPdCOJzLE0Q",
    consumerSecret : "YYWx9_1mm-RavY30d_pCOSezTfQ",
    accessToken : "YoOQDiRBW0B6KCkHdbdgCw0TYmoy7v6t",
    accessTokenSecret : "mS2xHZeID7dumI8zV6SzXOBcdZE",
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
};

var POICategories =
    'amusementparks,climbing,beaches,hiking,sailing,surfing,arts,boatcharters,caricatures,facepainting,magicians,musicians,tours,resorts,skiresorts,localflavor,nightlife,landmarks';

/* Applies a callback function on a list containing either
restaurants or points of interest within 25 miles of each location in the LISTOFCOORDS.

Required arguments:
  callback     : a function which is applied to resultArr
  listOfCoords : a list of of objcts with lat and lng fields.
  categories   : a string of comma-separated categories.
  getFood      : determines whether restaurants or POIs are returned.

resultArr object fields:
  name         : The name of the restaurant.
  coordinate   : An object whose fields are latitude and longitude.
  rating       : The rating of the restaurant.
  categories   : The string containing the categories to which
                 a specific restaurant belongs. */

function getLocationsForWaypoints(listOfCoords, categoriesList, getFood, callback) {
    var resultMap = new Map();
    var deferred = [];
    function reversecompare(a,b) {
        if (a.est_score > b.est_score) {
            return -1;
        } else if (a.est_score < b.est_score) {
            return 1;
        } else {
            return 0;
        }
    }

    if (getFood) {
        for (i = 0; i < listOfCoords.length; i++) {
            deferred.push(getNearbyRestaurants(listOfCoords[i].lat(), listOfCoords[i].lng(), categoriesList[i]));
        }
        $.when.apply($, deferred).done(function(){
          var objects = arguments;
          for (k = 0; k < listOfCoords.length; k += 1) {
              extractRestaurants(objects[k][0], resultMap);
          };
          resultArr = Array.from(resultMap.values());
          resultArr.sort(reversecompare);
          callback(resultArr);
        });
    } else {
        for (i = 0; i < listOfCoords.length; i++) {
            deferred.push(getNearbyPOI(listOfCoords[i].lat(), listOfCoords[i].lng(), resultArr, categoriesList[i]));
        }
        $.when.apply($, deferred).done(function(){
          var objects = arguments;
          for (k = 0; k < listOfCoords.length; k += 1) {
              extractPOI(objects[k][0], resultMap);
          };
          resultArr = Array.from(resultMap.values());
          resultArr.sort(reversecompare);
          callback(resultArr);
        });
    }
}


////////////////////////
//  Helper Functions  //
////////////////////////

/* Makes a request through the Yelp API to obtain a list of
nearby restaurants. */
function getNearbyRestaurants(lat, lon, categories="food") {
    var terms = 'food';
    var ll = lat.toString() + ',' + lon.toString();
    var category_filter = categories;
    var sort = 2;

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', ll]);
    parameters.push(['category_filter', category_filter]);
    parameters.push(['sort', sort]);
    parameters.push(['callback', 'callback']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'https://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);

    return $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'cache': true
    })
    .done(function(data, textStatus, jqXHR) {})
    .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
        }
    );
}

/* Makes a request through the Yelp API to obtain a list of nearby
points of interest. Must pass in a list into which the result
is appended. */
function getNearbyPOI(lat, lon, list, categories = '') {
    var ll = lat.toString() + ',' + lon.toString();
    var category_filter = 'landmarks';
    var sort = 2;

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['ll', ll]);
    parameters.push(['category_filter', category_filter]);
    parameters.push(['callback', 'restaurantExtract']);
    parameters.push(['sort', sort]);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'https://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);

    return $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'cache': true
    })
    .done(function(data, textStatus, jqXHR) {})
    .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
        }
    );
}

/* Helper function which extracts relevant information from returned
JSON, and appends it to a list of results. */
function extractRestaurants(data, map) {
    for (i = 0; i < Math.min(data.businesses.length, 5); i++) {
        var cats = '';
        for (j = 0; j < Math.min(data.businesses[i].categories.length, 3); j++) {
          cats += data.businesses[i].categories[j][0] + ", ";
        }
        cats = cats.slice(0, -2);

        var temp = {name        :  data.businesses[i].name,
                    coordinate  :  data.businesses[i].location.coordinate,
                    rating      :  data.businesses[i].rating,
                    categories  :  cats,
                    est_score   :  ((data.businesses[i].rating / 5) * data.businesses[i].review_count + 1)
                                   / (data.businesses[i].review_count + 2)};
        map.set(JSON.stringify(temp), temp);
    }
}

/* Helper function which extracts relevant information from returned
JSON, and appends it to a list of results. */
function extractPOI(data, map) {
    for (i = 0; i < Math.min(data.businesses.length, 10); i++) {
        var cats = '';
        for (j = 0; j < Math.min(data.businesses[i].categories.length, 3); j++) {
          cats += data.businesses[i].categories[j][0] + ", ";
        }
        cats = cats.slice(0, -2);

        var temp = {name        :  data.businesses[i].name,
                    coordinate  :  data.businesses[i].location.coordinate,
                    rating      :  data.businesses[i].rating,
                    categories  :  cats,
                    est_score   :  ((data.businesses[i].rating / 5) * data.businesses[i].review_count + 1)
                                   / (data.businesses[i].review_count + 2)};
        map.set(JSON.stringify(temp), temp);
    }
}
