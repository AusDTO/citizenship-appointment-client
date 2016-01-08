'use strict';

const getBookableMonths = require('./getBookableMonths');
const getCalendarStructure = require('./getCalendarStructure');
const getAvailableDatesWithTimes = require('./getAvailableDatesWithTimes');

class Calendar {
  constructor(availableDates) {
    this.bookableMonths = getBookableMonths(availableDates);
    this.calendarStructure = getCalendarStructure(this.bookableMonths, availableDates);
    this.availableDatesWithTimes = getAvailableDatesWithTimes(availableDates);
  }
}

module.exports = (availableDates) => {
  return new Calendar(availableDates);
};
