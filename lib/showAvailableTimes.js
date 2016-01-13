'use strict';

const datetime = require('./datetime');
const dom = require('./domHelpers');
const times_template = require('../views/client/times.mustache');

module.exports = (dateString, availableDatesWithTimes, todayDate) => {
  dom.hideElementsBySelectors('.AvailableTimes');
  document.querySelector(`.AvailableTimes.date-${dateString}`).style.display = '';
  const date = datetime(dateString);

  availableDatesWithTimes[dateString].available_times.then((availableTimes) => {

    if (date.isSameDay(todayDate)) {
      availableTimes = availableTimes.filter((datetime) => { return datetime.isAfter(todayDate); });
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

    if(window.location.hash) {
      let [hashType, hashValue] = location.hash.split("/");
      if (hashType === '#time') {
        let className = datetime(hashValue).toDateTimeClassString();
        dom.addClassToElements(`.AppointmentTimes-list--item.datetime-${className}`, 'is-active');
      }
    }

  }, (err) => {
    // FIXME(Emily)
    // Error may occur if trying to render times before calendar has been rendered
    // We can ignore this error as the calendar will try to render the times as well
  });
}
