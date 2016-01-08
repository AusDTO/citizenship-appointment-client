'use strict';

const dom = require('./domHelpers');

module.exports = (month) => {
  dom.hideElementsBySelectors('.Calendar');
  document.querySelector(`.Calendar.month-${month}`).style.display = '';
}
