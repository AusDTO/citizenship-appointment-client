'use strict';

const dom = require('./domHelpers');
const times_template = require('../views/client/times.mustache');

module.exports = (date, availableDatesWithTimes) => {
  dom.hideElementsBySelectors('.AvailableTimes');
  document.querySelector(`.AvailableTimes.date-${date}`).style.display = '';

  // TODO: Refactor to get rid of global object
  availableDatesWithTimes[date].available_times.then((availableTimes) => {

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

    document.querySelector(`.AvailableTimesCell.date-${date}`).innerHTML = renderedTimesHtml;
  }, (err) => {
    // FIXME(Emily)
    // Error may occur if trying to render times before calendar has been rendered
    // We can ignore this error as the calendar will try to render the times as well
  });
}
