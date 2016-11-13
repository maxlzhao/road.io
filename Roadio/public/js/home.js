
// $(function(){

// $('#rohansbutton').on('click', function (e) {
//     window.location.href = '/map'
// });

    
// // $('#datetimepicker6').datetimepicker();
// //             $('#datetimepicker7').datetimepicker({
// //                 useCurrent: false //Important! See issue #1075
// //             });
// //             $("#datetimepicker6").on("dp.change", function (e) {
// //                 $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
// //             });
// //             $("#datetimepicker7").on("dp.change", function (e) {
// //                 $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
// //             });

// // document.getElementById("imputForm").submit();

// // $("form").each( function(){
// //     var json = {"form": []};
// //     $(this).find("input").each( function(){
// //         var input = {};
// //         $.each(this.attributes, function(){
// //             if(this.specified){
// //                 input[this.name] = this.value;   
// //             }
// //         });
// //         json.form.push(input);
// //     });    
// //     console.log(json);
// //     window.location.href = '/map'
// // });

// // $('#inputform').submit(function() {
// //     console.log("hello");
// // $.post('ajax/input.jade', function(data) {      
// // });
// //   console.log("hello");
// //   return false;
// // });

// $("form").each( function(){
//     var json = {"form": []};
//     $(this).find("input").each( function(){
//         var input = {};
//         $.each(this.attributes, function(){
//             if(this.specified){
//                 input[this.name] = this.value;   
//             }
//         });
//         json.form.push(input);
//     });    
//     console.log(json);

// $( "#beginDate" ).datetimepicker();
// $( "#endDate" ).datetimepicker();

// });
// });

// function initMap() {
//   var input = /** @type {!HTMLInputElement} */(
//       document.getElementById('#input1'));

//   var autocomplete = new google.maps.places.Autocomplete(input);
//   autocomplete.bindTo('bounds', map);

//   var infowindow = new google.maps.InfoWindow();


//   autocomplete.addListener('place_changed', function() {
//     infowindow.close();
//     marker.setVisible(false);
//     var place = autocomplete.getPlace();
//     if (!place.geometry) {
//       // User entered the name of a Place that was not suggested and
//       // pressed the Enter key, or the Place Details request failed.
//       window.alert("No details available for input: '" + place.name + "'");
//       return;
//     }

//     // If the place has a geometry, then present it on a map.
//     if (place.geometry.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     } else {
//       map.setCenter(place.geometry.location);
//       map.setZoom(17);  // Why 17? Because it looks good.
//     }
//     marker.setIcon(/** @type {google.maps.Icon} */({
//       url: place.icon,
//       size: new google.maps.Size(71, 71),
//       origin: new google.maps.Point(0, 0),
//       anchor: new google.maps.Point(17, 34),
//       scaledSize: new google.maps.Size(35, 35)
//     }));
//     marker.setPosition(place.geometry.location);
//     marker.setVisible(true);

//     var address = '';
//     if (place.address_components) {
//       address = [
//         (place.address_components[0] && place.address_components[0].short_name || ''),
//         (place.address_components[1] && place.address_components[1].short_name || ''),
//         (place.address_components[2] && place.address_components[2].short_name || '')
//       ].join(' ');
//     }

//     infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//     infowindow.open(map, marker);
//   });

//   // Sets a listener on a radio button to change the filter type on Places
//   // Autocomplete.
//   function setupClickListener(id, types) {
//     var radioButton = document.getElementById(id);
//     radioButton.addEventListener('click', function() {
//       autocomplete.setTypes(types);
//     });
//   }

//   setupClickListener('changetype-all', []);
//   setupClickListener('changetype-address', ['address']);
//   setupClickListener('changetype-establishment', ['establishment']);
//   setupClickListener('changetype-geocode', ['geocode']);
// }