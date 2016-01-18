'use strict';

const datetime = require('../datetime/datetime');

module.exports = (availableDates, dateString) => {
  let calendarId = availableDates[dateString].calendar_id;
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();
    request.open('GET', `get_available_times?calendar_id=${calendarId}`);
    request.onload = () => {
      if (request.status === 200) {
        let availableTimes =
            JSON.parse(request.responseText).times.map((time) => {
              return datetime(`${dateString} ${time}`);
            });
        resolve(availableTimes);
      } else {
        reject(request.statusText);
      }
    };
    request.onerror = () => {
      reject("There was a problem sending the request.");
    };
    request.send();
  });
}
