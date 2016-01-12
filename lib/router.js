'use strict';

const dom = require('./domHelpers');
const datetime = require('./datetime');
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
      highlightDateCell(hashValue);
      showAvailableTimes(hashValue, calendar.availableDatesWithTimes, calendar.todayDate);
    } else if (hashType === '#time') {
      highlightTimesCell(hashValue);
      showSelectionConfirmation(hashValue);
    }
  }
};

let highlightDateCell = (date) => {
  dom.removeClassFromElements('.Calendar-date--bookable.is-active', 'is-active');
  dom.addClassToElements(`.Calendar-date--bookable.date-${date}`, 'is-active');
};

let highlightTimesCell = (datetimeString) => {
  let className = datetime(datetimeString).toDateTimeClassString();
  dom.removeClassFromElements('.AppointmentTimes-list--item.is-active', 'is-active');
  dom.addClassToElements(`.AppointmentTimes-list--item.datetime-${className}`, 'is-active');
};
