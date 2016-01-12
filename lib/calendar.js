'use strict';

const datetime = require('./datetime');
const getBookableMonths = require('./getBookableMonths');
const getCalendarStructure = require('./getCalendarStructure');
const getAvailableDatesWithTimes = require('./getAvailableDatesWithTimes');

class Calendar {
  constructor(availableDates, todayDateString) {
    this.todayDate = datetime(todayDateString);
    this.bookableMonths = getBookableMonths(availableDates);
    this.calendarStructure = getCalendarStructure(this.bookableMonths, availableDates, this.todayDate);
    this.availableDatesWithTimes = getAvailableDatesWithTimes(availableDates);
  }
}

module.exports = (availableDates, todayDateString) => {
  return new Calendar(availableDates, todayDateString);
};
