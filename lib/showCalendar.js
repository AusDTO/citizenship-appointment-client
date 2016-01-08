'use strict';

const dom = require('./domHelpers');

module.exports = (month) => {
  dom.hideElementsBySelectors('.BookingCalendar');
  document.querySelector(`.BookingCalendar.month-${month}`).style.display = '';
}
