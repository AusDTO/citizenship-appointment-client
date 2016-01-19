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


document.getElementById("print-page").addEventListener("click", function(){
	window.print();
});