'use strict';

const session_counter = require('./session/session_counter');

if (navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'none';
}

var calendarItems = document.getElementsByClassName('cal_option');

document.addEventListener('touchstart', function() {
  document.getElementById('calendarOptions').className = '';
}, null)

for(var i=0; i< calendarItems.length; i++){
	calendarItems[i].addEventListener('focus', function(){
    document.getElementById('calendarOptions').className = 'show-menu';
	}, null);

	calendarItems[i].addEventListener('blur', function(){
    document.getElementById('calendarOptions').className = '';
	}, null);
}

/*BEGIN: handle session timeout*/
function SessionExpiredEvent() {
    var addToCalendarDropdown =  document.getElementById('addToCalendarDropdown');
    addToCalendarDropdown.parentElement.removeChild(addToCalendarDropdown);
}

session_counter().setTimeoutEvent(SessionExpiredEvent);
/*END: handle session timeout*/

document.getElementById('print-page').addEventListener('click', function(){
	window.print();
}, null);
document.getElementById('print-page').style.display='inline';
