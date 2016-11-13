
$(function(){

$('#rohansbutton').on('click', function (e) {
    window.location.href = '/map'
});

    
// $('#datetimepicker6').datetimepicker();
//             $('#datetimepicker7').datetimepicker({
//                 useCurrent: false //Important! See issue #1075
//             });
//             $("#datetimepicker6").on("dp.change", function (e) {
//                 $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
//             });
//             $("#datetimepicker7").on("dp.change", function (e) {
//                 $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
//             });

// document.getElementById("imputForm").submit();

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
//     window.location.href = '/map'
// });

// $('#inputform').submit(function() {
//     console.log("hello");
// $.post('ajax/input.jade', function(data) {      
// });
//   console.log("hello");
//   return false;
// });

$("form").each( function(){
    var json = {"form": []};
    $(this).find("input").each( function(){
        var input = {};
        $.each(this.attributes, function(){
            if(this.specified){
                input[this.name] = this.value;   
            }
        });
        json.form.push(input);
    });    
    console.log(json);

$( "#beginDate" ).datetimepicker();
$( "#endDate" ).datetimepicker();

});
});



function submitform(){
    console.log("hello");
}