'use strict';

require("babel-polyfill");

const calendar = require('./calendar/calendar');
const calendarRenderer = require('./calendar/calendarRenderer');
const router = require('./calendar/router');
const dom = require('./helpers/domHelpers');
const session_counter = require('./session/session_counter');

let request = new XMLHttpRequest();
request.open('GET', '/get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
    let availableDates = JSON.parse(request.responseText);
    let foo = calendar(availableDates, document.querySelector('.Calendars').getAttribute('data-today'));
    calendarRenderer(foo);
    if(window.location.hash) {
      router(foo, true)();
    }
    window.addEventListener("hashchange", router(foo, false));
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
  window.location.hash = "#openModal";
}

function extendSession() {
  window.clearTimeout(timeoutEventId);
  request.open('GET', '/extend_session');
  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      window.location.hash = previousLocation;
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

document.getElementById("renew-session").addEventListener("click", function () {
  extendSession();
});
/*END: handle session timeout*/
