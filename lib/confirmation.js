'use strict';

const session_counter = require('./session/session_counter');
const dom = require('./helpers/domHelpers');

if (navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'none';
}

var calendarItems = document.getElementsByClassName('cal_option');

for(var i=0; i< calendarItems.length; i++){
	calendarItems[i].addEventListener('focus', function(){
    document.getElementById('calendarOptions').className = 'show-menu';
    // dom.addClass('#calendarOptions', 'show-menu');
	});

	calendarItems[i].addEventListener('blur', function(){
    document.getElementById('calendarOptions').className = '';
    // dom.removeClass('#calendarOptions', 'show-menu');
	});
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
});
document.getElementById('print-page').style.display='inline';
