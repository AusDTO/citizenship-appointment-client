'use strict';

require("babel-polyfill");

const calendar = require('./calendar');
const calendarRenderer = require('./calendarRenderer');
const router = require('./router');

let request = new XMLHttpRequest();
request.open('GET', 'get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
    let availableDates = JSON.parse(request.responseText);
    let foo = calendar(availableDates);
    calendarRenderer(foo);
    window.addEventListener("hashchange", router(foo));
  } else {
    // We reached our target server, but it returned an error
  }
};

request.onerror = () => {
  // There was a connection error of some sort
};

request.send();
