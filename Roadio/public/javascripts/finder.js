// Note: need to import these in html file!!!
//
// <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
// <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/OAuth.js"></script>
// <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/SHA1.js"></script>

/* Debugging purposes only */
test_list = [{lat : 37.8719,
              lng : -122.2585},
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

/* Returns a list containing either restaurants or points of interest
within 25 miles of each location in the LISTOFCOORDS.

Warning: The function makes asynchronous calls, so the list that is returned
is initially empty. */
function getLocationsForWaypoints(callback, listOfCoords, categoriesList, getFood="food") {
    var resultArr = [];
    var deferred = [];

    if (getFood) {
        for (i = 0; i < listOfCoords.length; i++) {
            deferred.push(getNearbyRestaurants(listOfCoords[i].lat, listOfCoords[i].lng, categoriesList[i]));
        }
        $.when.apply($, deferred).done(function(){
          var objects = arguments;
          for (k = 0; k < listOfCoords.length; k += 1) {
              extractRestaurants(objects[k][0], resultArr);
          };
          callback(resultArr);
        });
    } else {
        for (i = 0; i < listOfCoords.length; i++) {
            deferred.push(getNearbyPOI(listOfCoords[i].lat, listOfCoords[i].lng, resultArr, categoriesList[i]));
        }
        $.when.apply($, deferred).done(function(){
          var objects = arguments;
          for (k = 0; k < listOfCoords.length; k += 1) {
              extractPOI(objects[k][0], resultArr);
          };
          callback(resultArr);
        });
    }
}


////////////////////////
//  Helper Functions  //
////////////////////////

/* Makes a request through the Yelp API to obtain a list of
nearby restaurants. Must pass in a list into which the result
is appended.

Each resulting object for each restaurant has the
following fields:

name       : The name of the restaurant.
coordinate : An object whose fields are latitude and longitude.
rating     : The rating of the restaurant.
categories : The string containing the categories to which
             a specific restaurant belongs. */
function getNearbyRestaurants(lat, lon, categories="food") {
    var terms = 'food';
    var ll = lat.toString() + ',' + lon.toString();
    var category_filter = categories;

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['term', terms]);
    parameters.push(['ll', ll]);
    parameters.push(['category_filter', category_filter]),
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
is appended.

Each resulting object for each point of interest has the
following fields:
name       : The name of the point of interest.
coordinate : An object whose fields are latitude and longitude.
rating     : The rating of the point of interest.
categories : The string containing the categories to which
             a specific point of interest belongs. */
function getNearbyPOI(lat, lon, list, categories = '') {
    var ll = lat.toString() + ',' + lon.toString();
    var category_filter = 'landmarks';

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['ll', ll]);
    parameters.push(['category_filter', category_filter]),
    parameters.push(['callback', 'restaurantExtract']);
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
function extractRestaurants(data, list) {
    for (i = 0; i < Math.min(data.businesses.length, 5); i++) {
      var cats = '';
      for (j = 0; j < Math.min(data.businesses[i].categories.length, 3); j++) {
        cats += data.businesses[i].categories[j][0] + ", ";
      }
      cats = cats.slice(0, -2);

      list.push({name        :  data.businesses[i].name,
                 coordinate  :  data.businesses[i].location.coordinate,
                 rating      :  data.businesses[i].rating,
                 categories  :  cats});
    }
}

function extractPOI(data, list) {
    for (i = 0; i < Math.min(data.businesses.length, 10); i++) {
      var cats = '';
      for (j = 0; j < Math.min(data.businesses[i].categories.length, 3); j++) {
        cats += data.businesses[i].categories[j][0] + ", ";
      }
      cats = cats.slice(0, -2);

      list.push({name        :  data.businesses[i].name,
                 coordinate  :  data.businesses[i].location.coordinate,
                 rating      :  data.businesses[i].rating,
                 categories  :  cats});
    }
}
