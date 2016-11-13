var iterationIndex = 0;
var hotelAreaIndex=0;
var desiredHotels = [];
//var originalPOIs;
function go() {};
function not_go() {};

$(document).ready(function () {
    //console.log("ASDASD")
    var url = window.location.href
    var urlParams = parseURLParams(url)
    var A = urlParams["startLocation"][0]
    var B = urlParams["endLocation"][0]
    var time_start = convertDateFormat(urlParams["beginDate"][0])
    var time_end = convertDateFormat(urlParams["endDate"][0])
    var allotted=parseInt(time_end.substring(3,5))-parseInt(time_start.substring(3,5))
    //console.log(url)
    potentialHotels(A,B,"2016-11-14",allotted,function(hotels){
        //console.log(hotels)
        //$("#photo-container").find(".front").attr("src", POIs[0].image_url);
        //$("#photo-container").find(".back").attr("src", POIs[1].image_url);
        $(".title1").text(hotels[0][0].property_name);
        //$(".review").text(list_of_list_hotels[0].snippet_text);
        originalHotels = hotels;

        go = function(){
            
            if (hotelAreaIndex+1 == hotels.length) {
              desiredHotels.push(hotels[hotelAreaIndex][iterationIndex]);
              localStorage.setItem("desiredHotels",JSON.stringify(desiredHotels))
              window.location.href = "map?startLocation="+A+"&endLocation="+B
            }
            else {
              desiredHotels.push(hotels[hotelAreaIndex][iterationIndex]);
              console.log(hotelAreaIndex);
              console.log(iterationIndex);
              hotelAreaIndex++;
              iterationIndex=0;
              $(".title1").text(hotels[hotelAreaIndex][iterationIndex].property_name);
              //$(".review").text(POIs[iterationIndex].snippet_text);
            }
            
        };
        not_go = function(){
              console.log(iterationIndex);
              iterationIndex++;
              if(iterationIndex+1 == hotels[hotelAreaIndex].length){
                go()
              }
              $(".title1").text(hotels[hotelAreaIndex][iterationIndex].property_name);
              //$(".review").text(POIs[iterationIndex].snippet_text);
        };
    });
});

$(document).ready(function() {
  $("#going").click(function(){
      /*
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 2].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 2].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");*/
      go();
  });

  $("#not-going").click(function(){
        /*
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
          $("#photo-container").find(".back").attr("src", originalPOIs[iterationIndex + 2].image_url);
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
          $("#photo-container").find(".front").attr("src", originalPOIs[iterationIndex + 2].image_url);
      }
      $("#photo-container").find(".front").toggleClass("hidden");*/
      not_go();
  });
});
