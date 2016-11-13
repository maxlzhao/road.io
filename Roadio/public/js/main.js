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
        $(".title").text(POIs[0].name);
        $(".review").text(POIs[0].snippet_text);
        originalPOIs = POIs;

        go = function(){
            
            if (iteratorIndex >= freeDays) {
              window.location.href = "rotationPOIpicker.jade"
            }
            else {
              desiredPOIs.push(POIs[iterationIndex]);
              console.log(iterationIndex);
              iterationIndex++;
              $(".title").text(POIs[iterationIndex].name);
              $(".review").text(POIs[iterationIndex].snippet_text);
            }
            
        };
        not_go = function(){
            
            if (iteratorIndex >= freeDays) {

            }
            else {
              console.log(iterationIndex);
              iterationIndex++;
              $(".title").text(POIs[iterationIndex].name);
              $(".review").text(POIs[iterationIndex].snippet_text);
            }
            
        };
    });
});

$(document).ready(function() {
  $("#going").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 2].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 2].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");
      go();
  });

  $("#not-going").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 2].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 2].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");
      not_go();
  });
});
