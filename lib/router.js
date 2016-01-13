'use strict';

const dom = require('./domHelpers');
const datetime = require('./datetime');
const showCalendar = require('./showCalendar');
const showAvailableTimes = require('./showAvailableTimes');
const showSelectionConfirmation = require('./showSelectionConfirmation');

module.exports = (calendar, onPageLoad) => {
  return () => {
    if (onPageLoad) {
      let [hashType, hashValue] = location.hash.split("/");
      if (hashType === '#month') {
        showCalendar(hashValue);
      } else if (hashType === '#date') {
        let date = datetime(hashValue);
        showCalendar(date.toMonthString());

        dom.highlightDateCell(hashValue);
        showAvailableTimes(hashValue, calendar.availableDatesWithTimes, calendar.todayDate);
      } else if (hashType === '#time') {
        let date = datetime(hashValue);
        showCalendar(date.toMonthString());

        dom.highlightDateCell(date.toDateString());
        showAvailableTimes(date.toDateString(), calendar.availableDatesWithTimes, calendar.todayDate);

        dom.highlightTimesCell(date.toDateTimeClassString());
        showSelectionConfirmation(hashValue);
      }
    } else {
      dom.clearSelection();
      let [hashType, hashValue] = location.hash.split("/");
      if (hashType === '#month') {
        showCalendar(hashValue);
      } else if (hashType === '#date') {
        dom.highlightDateCell(hashValue);
        showAvailableTimes(hashValue, calendar.availableDatesWithTimes, calendar.todayDate);
      } else if (hashType === '#time') {
        let className = datetime(hashValue).toDateTimeClassString();
        dom.highlightTimesCell(className);
        showSelectionConfirmation(hashValue);
      }
    }
  }
};

