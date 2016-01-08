'use strict';

const datetime = require('./datetime');
const REQUEST_DELAY = 100;

module.exports = (availableDates) => {
  let calendarId, delay = 0;

  for(let dateString of Object.keys(availableDates)) {
    calendarId = availableDates[dateString].calendar_id;
    availableDates[dateString].available_times = new Promise( function (resolve, reject) {
      setTimeout( () => {
        let request = new XMLHttpRequest();
        request.open('GET', `get_available_times?calendar_id=${calendarId}`);
        request.onload = () => {
          if (request.status === 200) {
            let availableTimes =
                JSON.parse(request.responseText).times.map((time) => { return datetime(`${dateString} ${time}`); });
            resolve(availableTimes);
          } else {
            reject(request.statusText);
          }
        };
        request.onerror = () => {
          reject("There was a problem sending the request.");
        };
        request.send();
      }, delay);
    });
    delay += REQUEST_DELAY;
  }

  return availableDates;
}
