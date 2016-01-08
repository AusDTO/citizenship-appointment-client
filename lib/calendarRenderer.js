'use strict';

const dom = require('./domHelpers');
const showCalendar = require('./showCalendar');

const calendar_template = require('../views/client/calendar.mustache');
const month_template = require('../views/client/month.mustache');
const week_template = require('../views/client/week.mustache');
const day_template = require('../views/client/day.mustache');
const times_template = require('../views/client/times.mustache');

module.exports = (calendar) => {
  let renderedCalendarsHtml = calendar_template.render(calendar.calendarStructure, {
    month_template,
    week_template,
    day_template,
    times_template
  });
  document.querySelector('.where_calendars_go').innerHTML = renderedCalendarsHtml;

  dom.hideElementsBySelectors('.AvailableTimes');
  dom.hideElementsBySelectors('.SelectionConfirmation');
  showCalendar(calendar.bookableMonths[0].toMonthString());
}
