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
function SessionExpiredEvent() {
    window.location = "/session_timeout";
}

let session = session_counter();
session.setTimeoutEvent(SessionExpiredEvent);
/*END: handle session timeout*/
