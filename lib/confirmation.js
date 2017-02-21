'use strict';

const session_counter = require('./session/session_counter');
const modal_popup = require('./helpers/modal_popup');

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

function handleHashChange() {
  let hash = location.hash;
  if (hash === '#add-to-wallet-modal') {
    modal_popup('#add-to-wallet-modal').show();
  }
}

if (location.hash) {
  handleHashChange();
}

window.addEventListener('hashchange', handleHashChange, null);

Array.prototype.forEach.call(document.querySelectorAll('.add-to-wallet-modal-link'), (el) => {
  el.removeAttribute('href'); // required since setAttribute href with just a hash value appends to the existing href value
  el.setAttribute('href', '#add-to-wallet-modal');
  el.removeAttribute('target');
});

/*BEGIN: handle session timeout*/
function SessionExpiredEvent() {
    document.getElementById('print_page').style.display='none';
}

session_counter().setTimeoutEvent(SessionExpiredEvent);
/*END: handle session timeout*/

document.getElementById('print_page').addEventListener('click', function(){
	window.print();
}, null);
