var iterationIndex = 0;
var desiredPOIs = [];
var originalPOIs;
function go() {};
function not_go() {};

$(window).on('load',function () {
    var url = window.location.href
    var urlParams = parseURLParams(url)
    var A = urlParams["startLocation"][0]
    var B = urlParams["endLocation"][0]
    var keyword = urlParams["keywords"][0]
    console.log(window.location.href)
    potentialPOIsFreeDays(A,B,3,keyword,function(POIs,freeDays){
        $("#photo-container").find(".front").attr("src", POIs[0].image_url);
        $("#photo-container").find(".back").attr("src", POIs[1].image_url);
        originalPOIs = POIs;
        go = function(){
            desiredPOIs.push(POIs[iterationIndex]);
            console.log(iterationIndex);
            iterationIndex++;
        };
        not_go = function(){
            console.log(iterationIndex);
            iterationIndex++;
        };
    });
});

$(document).ready(function() {
  $("#going").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 1].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 1].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");
      go();
  });

  $("#not-going").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 1].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 1].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");
      not_go();
  });
});
