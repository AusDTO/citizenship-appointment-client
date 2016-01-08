'use strict';

const dom = require('./domHelpers');
const showCalendar = require('./showCalendar');
const showAvailableTimes = require('./showAvailableTimes');
const showSelectionConfirmation = require('./showSelectionConfirmation');

module.exports = (calendar) => {
  return () => {
    dom.clearSelection();
    let [hashType, hashValue] = location.hash.split("/");
    if (hashType === '#month') {
      showCalendar(hashValue);
    } else if (hashType === '#date') {
      showAvailableTimes(hashValue, calendar.availableDatesWithTimes);
    } else if (hashType === '#time') {
      showSelectionConfirmation(hashValue);
    }
  }
};
