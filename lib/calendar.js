'use strict';

const bookable = require('./bookable');
let calendar_template = require('../views/client/calendar.mustache');
let month_template = require('../views/client/month.mustache');
let week_template = require('../views/client/week.mustache');
let day_template = require('../views/client/day.mustache');

module.exports = (availableDates) => {
  let bookableMonths = bookable.getBookableMonths(availableDates);
  let calendarStructure = bookable.getCalendarStructure(bookableMonths, availableDates);

  let renderedCalendarsHtml = calendar_template.render(calendarStructure, {
    month_template,
    week_template,
    day_template
  });

  document.querySelector('.where_calendars_go').innerHTML = renderedCalendarsHtml;

  showCalendar(bookableMonths[0].toMonthString());
  window.addEventListener("hashchange", onHashChange);
}

let hideCalendars = () => {
  let calendarElements = document.querySelectorAll('.BookingCalendar');
  for (let calendar of calendarElements) {
    calendar.style.display = 'none';
  }
}

let showCalendar = (hashValue) => {
  hideCalendars();
  document.querySelector(`.BookingCalendar.month-${hashValue}`).style.display = '';
}

let onHashChange = () => {
  let [hashType, hashValue] = location.hash.split("/");
  if (hashType === "#month") {
    showCalendar(hashValue);
  }
};
