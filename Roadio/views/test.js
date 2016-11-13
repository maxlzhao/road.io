$(document).ready(function() {
  $(".button").click(function(){
      if ($("#photo-container").find(".front").hasClass("hidden")) {
          $("#photo-container").find(".front").animate({opacity : 1}, {duration: 200, queue: false});
      } else {
          $("#photo-container").find(".front").animate({opacity : 0}, {duration: 200, queue: false});
      }
      $("#photo-container").find(".front").toggleClass("hidden");
  });
});
