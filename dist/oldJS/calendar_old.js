'use strict';

if(!('querySelector' in document && 'localStorage' in window && 'addEventListener' in window)) {
	document.querySelector('.warning-oldbrowsers').style.display='block';
}

if(document.querySelector('.no-available-dates') != null){
	window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
	window.ga('send', 'event', 'Calendar', 'no_appointments');
}
