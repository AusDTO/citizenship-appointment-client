'use strict';

const datetime = require('../datetime/datetime');
const dom = require('../helpers/domHelpers');
const getAvailableTimes = require('./getAvailableTimes')
const times_template = require('../../views/client/times.mustache');
const showSelectionConfirmation = require('./showSelectionConfirmation');
const RETRY_LIMIT = 3;
let retryCounter = 0;

module.exports = (dateString, availableDates, todayDate) => {
  let handlePromise = (availableTimes) => {
    if (date.isSameDay(todayDate)) {
      availableTimes = availableTimes.filter((datetime) => {
        return datetime.isAfter(todayDate);
      });
    }

    var mappedAT = availableTimes.map((time) => {
        return {
          timeClass: time.toDateTimeClassString(),
          datetime: time.toDateTimeString(),
          display_time: time.displayTime(),
          ampm: time.amPm()
        };
      })

    var dateCell = document.querySelector(`a.DateCell-content--datelink.date-${dateString}`);
    var startIndex = dateCell.tabIndex+1;
    mappedAT.forEach(function(value){
        value.tabindex = startIndex;
        startIndex+=1;
    })


    let renderedTimesHtml = times_template.render({
      times: mappedAT
    });

    document.querySelector(`.AvailableTimesCell.date-${dateString}`).innerHTML = renderedTimesHtml;

    if (window.location.hash) {
      let [hashType, hashValue] = location.hash.split("/");
      if (hashType === '#time') {
        let className = datetime(hashValue).toDateTimeClassString();
        dom.addClass(`.AppointmentTimes-list--item.datetime-${className}`, 'is-active');
        showSelectionConfirmation(hashValue);
      }
    }
  };

  let handlePromiseError = (err) => {
    if(err.status === 401) {
      window.location = '/login?expired=true';
    } else if (retryCounter < RETRY_LIMIT) {
      retryPromise(availableDates, dateString);
      retryCounter++;
    } else {
      err.status ? window.location = "error" : dom.renderSystemError('.calendar-page--main');
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
