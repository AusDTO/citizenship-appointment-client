'use strict';

const datetime = require('../datetime/datetime');
const dom = require('../helpers/domHelpers');
const getAvailableTimes = require('./getAvailableTimes')
const times_template = require('../../views/client/times.mustache');

module.exports = (dateString, availableDates, todayDate) => {
  dom.hideElementsBySelectors('.AvailableTimes');
  document.querySelector(`.AvailableTimes.date-${dateString}`).style.display = '';
  const date = datetime(dateString);

  if (availableDates[dateString].availableTimes === undefined) {
    availableDates[dateString].availableTimes = getAvailableTimes(availableDates, dateString);
  }

  availableDates[dateString].availableTimes.then((availableTimes) => {
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

  }, (err) => {
    // FIXME(Emily)
    // Error may occur if trying to render times before calendar has been rendered
    // We can ignore this error as the calendar will try to render the times as well
  });
}
