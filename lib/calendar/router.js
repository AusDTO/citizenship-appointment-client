'use strict';

const dom = require('../helpers/domHelpers');
const datetime = require('../datetime/datetime');
const showCalendar = require('./showCalendar');
const showAvailableTimes = require('./showAvailableTimes');
const showSelectionConfirmation = require('./showSelectionConfirmation');
const ga = require('ga');

module.exports = (calendar, onPageLoad) => {
  return () => {
    if (onPageLoad) {
      let [hashType, hashValue] = location.hash.split("/");
      ga('send', 'event', 'Calendar', hashType, hashValue);
      if (hashType === '#month') {
        showCalendar(hashValue);
      } else if (hashType === '#date') {
        let date = datetime(hashValue);
        showCalendar(date.toMonthString());

        dom.highlightDateCell(hashValue);
        showAvailableTimes(hashValue, calendar.availableDates, calendar.todayDate);
      } else if (hashType === '#time') {
        ga('send', 'event', 'Calendar', 'timeonly', hashValue.split('T')[1]);
        let date = datetime(hashValue);
        showCalendar(date.toMonthString());

        dom.highlightDateCell(date.toDateString());
        showAvailableTimes(date.toDateString(), calendar.availableDates, calendar.todayDate);

        dom.highlightTimesCell(date.toDateTimeClassString());
      }
    } else {
      dom.hideElementsBySelectors('.SelectionConfirmation');
      dom.clearHTML('.SelectionConfirmationCell');
      let [hashType, hashValue] = location.hash.split("/");
      ga('send', 'event', 'Calendar', hashType, hashValue);
      if (hashType === '#month') {
        showCalendar(hashValue);
        dom.focusFirstActiveMonthDate(hashValue);
      } else if (hashType === '#date') {
        dom.highlightDateCell(hashValue);
        showAvailableTimes(hashValue, calendar.availableDates, calendar.todayDate);
      } else if (hashType === '#time') {
        let className = datetime(hashValue).toDateTimeClassString();
        dom.highlightTimesCell(className);
        showSelectionConfirmation(hashValue);
      }
    }
  }
};
