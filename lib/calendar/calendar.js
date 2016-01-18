'use strict';

const datetime = require('../datetime/datetime');
const getBookableMonths = require('./getBookableMonths');
const getCalendarStructure = require('./getCalendarStructure');

class Calendar {
  constructor(availableDates, todayDateString) {
    this.availableDates = availableDates;
    this.todayDate = datetime(todayDateString);
    this.bookableMonths = getBookableMonths(this.availableDates);
    this.calendarStructure = getCalendarStructure(this.bookableMonths, this.availableDates, this.todayDate);
  }
}

module.exports = (availableDates, todayDateString) => {
  return new Calendar(availableDates, todayDateString);
};
