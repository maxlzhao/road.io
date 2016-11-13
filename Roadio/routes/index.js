var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.send('im the home page!');
 	res.render('home', { title: 'Home' });
});

router.get('/map', function(req, res, next){
	res.render('index', { title: 'Map'})
})

// NEW UNTESTED CODE
router.get('/poi', function(req, res, next) {
    res.render('rotationPOIpicker', { title: 'Pick interesting places' } )
})

router.get('/hotels', function(req, res, next) {
    res.render('rotationHOTELpicker', { title: 'Pick where to stay' } )
})

module.exports = router;
