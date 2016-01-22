'use strict';

const datetime = require('../datetime/datetime');
const dom = require('../helpers/domHelpers');
const getAvailableTimes = require('./getAvailableTimes')
const times_template = require('../../views/client/times.mustache');
const RETRY_LIMIT = 3;
let retryCounter = 0;

module.exports = (dateString, availableDates, todayDate) => {
  let handlePromise = (availableTimes) => {
    if (date.isSameDay(todayDate)) {
      availableTimes = availableTimes.filter((datetime) => {
        return datetime.isAfter(todayDate);
      });
    }

    let renderedTimesHtml = times_template.render({
      times: availableTimes.map((time) => {
        return {
          timeClass: time.toDateTimeClassString(),
          datetime: time.toDateTimeString(),
          display_time: time.displayTime(),
          ampm: time.amPm()
        };
      })
    });

    document.querySelector(`.AvailableTimesCell.date-${dateString}`).innerHTML = renderedTimesHtml;

    if (window.location.hash) {
      let [hashType, hashValue] = location.hash.split("/");
      if (hashType === '#time') {
        let className = datetime(hashValue).toDateTimeClassString();
        dom.addClass(`.AppointmentTimes-list--item.datetime-${className}`, 'is-active');
      }
    }
  };

  let handlePromiseError = (err) => {
    if (retryCounter < RETRY_LIMIT) {
      retryPromise(availableDates, dateString);
      retryCounter++;
    } else {
      window.location = "error";
    }
  };

  let retryPromise = (availableDates, dateString) => (setTimeout(() => {
    console.log(`Retry fetching available times for ${dateString}`);
    availableDates[dateString].availableTimes = getAvailableTimes(availableDates, dateString);
    availableDates[dateString].availableTimes.then(handlePromise, handlePromiseError);
  }, 1000));


  dom.hideElementsBySelectors('.AvailableTimes');
  document.querySelector(`.AvailableTimes.date-${dateString}`).style.display = '';
  const date = datetime(dateString);

  if (availableDates[dateString].availableTimes === undefined) {
    availableDates[dateString].availableTimes = getAvailableTimes(availableDates, dateString);
  }

  availableDates[dateString].availableTimes.then(handlePromise, handlePromiseError);
}
