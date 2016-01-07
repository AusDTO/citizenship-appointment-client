'use strict';

const datetime = require('./datetime');
const getBookableMonths = require('./getBookableMonths');
const getCalendarStructure = require('./getCalendarStructure');
const getAvailableDatesWithTimes = require('./getAvailableDatesWithTimes');

let calendar_template = require('../views/client/calendar.mustache');
let month_template = require('../views/client/month.mustache');
let week_template = require('../views/client/week.mustache');
let day_template = require('../views/client/day.mustache');
let times_template = require('../views/client/times.mustache');

let availableDatesWithTimes;

module.exports = (availableDates) => {
  let bookableMonths = getBookableMonths(availableDates);
  let calendarStructure = getCalendarStructure(bookableMonths, availableDates);
  availableDatesWithTimes = getAvailableDatesWithTimes(availableDates);

  let renderedCalendarsHtml = calendar_template.render(calendarStructure, {
    month_template,
    week_template,
    day_template,
    times_template
  });

  document.querySelector('.where_calendars_go').innerHTML = renderedCalendarsHtml;

  hideElementsBySelectors('.AvailableTimes');
  showCalendar(bookableMonths[0].toMonthString());
  window.addEventListener("hashchange", onHashChange);
}

let hideElementsBySelectors = (selectorString) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.style.display = 'none';
  }
}

let showCalendar = (month) => {
  hideElementsBySelectors('.BookingCalendar');
  document.querySelector(`.BookingCalendar.month-${month}`).style.display = '';
}

let showAvailableTimes = (date) => {
  hideElementsBySelectors('.AvailableTimes');
  document.querySelector(`.AvailableTimes.date-${date}`).style.display = '';

  // TODO: Refactor to get rid of global object
  availableDatesWithTimes[date].available_times.then((availableTimes) => {

    let renderedTimesHtml = times_template.render({
      times: availableTimes.map((time) => {
        return {
          datetime: time.toDateTimeString(),
          display_time: time.displayTime(),
          ampm: time.amPm() };
      })
    });

    document.querySelector(`.AvailableTimesCell.date-${date}`).innerHTML = renderedTimesHtml;
  }, (err) => {
    // FIXME(Emily)
    // Error may occur if trying to render times before calendar has been rendered
    // We can ignore this error as the calendar will try to render the times as well
  });
}

let onHashChange = () => {
  let [hashType, hashValue] = location.hash.split("/");
  if (hashType === '#month') {
    showCalendar(hashValue);
  } else if (hashType === '#date') {
    showAvailableTimes(hashValue);
  }
};
