'use strict';

document.querySelector('.warning-oldbrowsers').style.display='block';

var calendarItems = document.querySelectorAll("cal_option");

for(var i=0; i< calendarItems.length; i++){
	var calendarItem = calendarItems[i];
	if (calendarItem.addEventListener) {
	    calendarItems[i].addEventListener("focus", function(){
			document.getElementById("calendarOptions").className = "show-menu";
		});

		calendarItems[i].addEventListener("focusout", function(){
			document.getElementById("calendarOptions").className = "";
		});
	}
	else {
	   calendarItems[i].attachEvent("onfocus", function(){
			document.getElementById("calendarOptions").className = "show-menu";
		});

		calendarItems[i].attachEvent("onfocusout", function(){
			document.getElementById("calendarOptions").className = "";
		});
	}

}

var printButton = document.getElementById("print_page");
if (printButton.addEventListener) {
    printButton.addEventListener("click", function(){
		window.print();
	});
}
else {
   printButton.attachEvent("onclick", function(){
		window.print();
	});
}
document.getElementById("print_page").style.display="inline";
