var animate, left=0, imgObj=null, report = document.getElementById('report'), i=0;

function init(){
    var input1 = document.getElementById('input1');
    var autocomplete1 = new google.maps.places.Autocomplete(input1);
    var input2 = document.getElementById('input2');
    var autocomplete2 = new google.maps.places.Autocomplete(input2);
   imgObj = document.getElementById('logo');
   imgObj.style.position= 'absolute'; 
   imgObj.style.top = '240px';
   imgObj.style.left = '-300px';
   imgObj.style.visibility='hidden';

   moveRight();
}google.maps.event.addDomListener(window, 'load', init);


function moveRight(){
    left = parseInt(imgObj.style.left, 10);
    
    if (10 >= left) {
        imgObj.style.left = (left + 5) + 'px';
        imgObj.style.visibility='visible';

        animate = setTimeout(function(){moveRight();},20); // call moveRight in 20msec

        //stopanimate = setTimeout(moveRight,20);
    } else {
        stop();
    }
    //f();
}

function stop(){
   clearTimeout(animate);
}
// starting

window.onload = function() {init();};