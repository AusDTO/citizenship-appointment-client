'use strict';

require("babel-polyfill");

const calendar = require('./calendar/calendar');
const calendarRenderer = require('./calendar/calendarRenderer');
const router = require('./calendar/router');
const dom = require('./helpers/domHelpers');
const session_counter = require('./session/session_counter');
const ga = require('ga');
const modal_popup = require('./helpers/modal_popup');

let request = new XMLHttpRequest();
let previousFocus;

document.getElementsByClassName('Old-Calendar-Needed-message')[0].style.display = 'none';
document.getElementsByClassName('Loading-message')[0].style.display = 'block';

request.open('GET', '/get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
    let availableDates = JSON.parse(request.responseText);
    if( Object.keys(availableDates).length < 1) { //no dates available
        modal_popup('#no-appt-modal').show();
    }
    let foo = calendar(availableDates, document.querySelector('.Calendars').getAttribute('data-today'));
    calendarRenderer(foo);
    if(window.location.hash) {
      router(foo, true)();
    }
    window.addEventListener("hashchange", (e) => { router(foo, false)(); }, null);
  } else {
    window.location = "error";
  }
};

request.onerror = () => {
  dom.renderSystemError('.calendar-page--main');
};

request.send();

/*BEGIN: handle session timeout*/
let session = session_counter();
let previousLocation = window.location.hash;
let timeoutEventId = session.setTimeoutEvent(expireSession);

function expireSession() {
    window.location = "/session_timeout";
}

function sessionExpiryNotification() {
  previousLocation = window.location.hash;
  previousFocus = document.activeElement;
  var modal = modal_popup('#session-open-modal');
  modal.show();

  document.getElementById('extend-session').addEventListener('click', () => {
    ga('send', 'event', 'Calendar', 'extend_session');
    extendSession();
    window.location.hash = previousLocation;
    modal.closeModal();
    previousFocus.focus();
  }, null);
}

function extendSession() {
  window.clearTimeout(timeoutEventId);
  request.open('GET', '/extend_session');
  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      session.setNotificationBeforeExpiry(sessionExpiryNotification);
      timeoutEventId = session.setTimeoutEvent(expireSession);
    } else {
      window.location = "error";
    }
  };
  request.onerror = () => {
    window.location = "error";
  };
  request.send();
}

session.setNotificationBeforeExpiry(sessionExpiryNotification);

/*END: handle session timeout*/
