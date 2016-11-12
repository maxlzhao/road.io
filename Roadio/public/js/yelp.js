//    Note: need to import these in html file!!! 
//
//    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
//    <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/OAuth.js"></script>
//    <script type="text/javascript" src="https://raw.githubusercontent.com/rmxdave/phnx/master/lib/OAuth/SHA1.js"></script>


var auth = {
    consumerKey : "NP1wcdFPMAvBPdCOJzLE0Q",
    consumerSecret : "YYWx9_1mm-RavY30d_pCOSezTfQ",
    accessToken : "YoOQDiRBW0B6KCkHdbdgCw0TYmoy7v6t",
    accessTokenSecret : "mS2xHZeID7dumI8zV6SzXOBcdZE",
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
};

/* Returns an array of objects containing information about
nearby restaurants and their absolute locations.

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

  $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'dataType' : 'jsonp',
      'cache': true
  })
  .done(function(data, textStatus, jqXHR) {
          restaurantExtract(data);
      }
  )
  .fail(function(jqXHR, textStatus, errorThrown) {
          console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
      }
  );
}

var listOfRestaurants;

/* Helper function which extracts relevant information from returned
JSON, and assigns it to list of restaurants. */
function restaurantExtract(data) {
    var result = []
    for (i = 0; i < 5; i++) {
      var cats = '';
      for (j = 0; j < Math.min(data.businesses[i].categories.length, 3); j++) {
        cats += data.businesses[i].categories[j][0] + ", ";
      }
      cats = cats.slice(0, -2);

      result.push({name        :  data.businesses[i].name,
                   coordinate  :  data.businesses[i].location.coordinate,
                   rating      :  data.businesses[i].rating,
                   categories  :  cats});
    }
    listOfRestaurants = result;
}
