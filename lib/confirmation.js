'use strict';

var calendarItems = document.getElementsByClassName("cal_option");

for(var i=0; i< calendarItems.length; i++){
	calendarItems[i].addEventListener("focus", function(){
		document.getElementById("calendarOptions").className = "show-menu";
	});

	calendarItems[i].addEventListener("focusout", function(){
		document.getElementById("calendarOptions").className = "";
	});
}


var SessionTime = 30*60*1000-1000;

setTimeout(SessionExpireEvent, SessionTime);

function SessionExpireEvent() {
    var addToCalendarDropdown =  document.getElementById("addToCalendarDropdown");
    addToCalendarDropdown.parentElement.removeChild(addToCalendarDropdown);
}

document.getElementById("print-page").addEventListener("click", function(){
	window.print();
});