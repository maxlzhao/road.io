/**
 * jTinder initialization
 */
$(window).on('load',function () {
    var url = window.location.href 
    var urlParams = parseURLParams(url)
    var A = urlParams["startLocation"][0]
    var B = urlParams["endLocation"][0]
    var keyword = urlParams["keywords"][0]
    console.log(window.location.href)
    potentialPOIsFreeDays(A,B,3,keyword,function(POIs,freeDays){
        console.log(POIs)
    });
});

$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
        $('#status').html('Dislike image ' + (item.index()+1));
    },
	// like callback
    onLike: function (item) {
	    // set the status text
        $('#status').html('Like image ' + (item.index()+1));
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});
