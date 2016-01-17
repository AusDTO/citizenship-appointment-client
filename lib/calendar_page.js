'use strict';

require("babel-polyfill");

const calendar = require('./calendar/calendar');
const calendarRenderer = require('./calendar/calendarRenderer');
const router = require('./calendar/router');

let request = new XMLHttpRequest();
request.open('GET', 'get_available_dates.json');

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
    // We reached our target server, but it returned an error
  }
};

request.onerror = () => {
  // There was a connection error of some sort
};

request.send();
