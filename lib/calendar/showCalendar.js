'use strict';

const dom = require('../helpers/domHelpers');

module.exports = (month) => {
  dom.unhighlightDateCells();
  dom.hideElementsBySelectors('.AvailableTimes');
  dom.hideElementsBySelectors('.Calendar');
  document.querySelector(`.Calendar.month-${month}`).style.display = '';
}
