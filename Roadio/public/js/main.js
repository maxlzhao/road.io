var iterationIndex = 0;
var desiredPOIs = [];
var originalPOIs;
function go() {};
function not_go() {};

$(document).ready(function () {
    var url = window.location.href
    var urlParams = parseURLParams(url)
    var A = urlParams["startLocation"][0]
    var B = urlParams["endLocation"][0]
    var time_start = urlParams["beginDate"][0]
    var time_start_formatted=convertDateFormat(time_start)
    var time_end = urlParams["endDate"][0]
    var time_end_formatted = convertDateFormat(time_end)
    console.log(parseInt(time_end.substring(3,5)))
    var allotted=parseInt(time_end_formatted.substring(3,5))-parseInt(time_start_formatted.substring(3,5))
    var keyword = urlParams["keywords"][0]
    console.log(window.location.href)
    potentialPOIsFreeDays(A,B,allotted,keyword,function(POIs,freeDays){
        $("#photo-container").find(".front").attr("src", POIs[0].image_url);
        $("#photo-container").find(".back").attr("src", POIs[1].image_url);
        $(".title").text(POIs[0].name);
        $(".review").text(POIs[0].snippet_text);
        originalPOIs = POIs;

        go = function(){
            
            if (desiredPOIs.length >= freeDays) {
              desiredPOIs.push(POIs[iterationIndex]);
              localStorage.clear()
              localStorage.setItem("desiredPOIs",JSON.stringify(desiredPOIs));
              window.location.href = "hotels?startLocation="+A+"&endLocation="+B+"&beginDate="+time_start+"&endDate="+time_end
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
            
              console.log(iterationIndex);
              iterationIndex++;
              $(".title").text(POIs[iterationIndex].name);
              $(".review").text(POIs[iterationIndex].snippet_text);
            
        };
    });
});

$(document).ready(function() {
  $("#going").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          if(originalPOIs[iterationIndex + 2].image_url != null){
            $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 2].image_url);
           }else{
                iterationIndex+=2
           }
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          if(originalPOIs[iterationIndex + 2].image_url != null){
            $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 2].image_url);
           }else{
                iterationIndex+=2
           }
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
