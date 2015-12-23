'use strict';

let slotpicker = require('./slotpicker');

let request = new XMLHttpRequest();
request.open('GET', 'get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 400) {
    let availableDates = JSON.parse(request.responseText);
    slotpicker(availableDates);
  } else {
    // We reached our target server, but it returned an error
  }
};

request.onerror = () => {
  // There was a connection error of some sort
};

request.send();
