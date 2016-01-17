'use strict';

const dom = require('../helpers/domHelpers');

module.exports = (month) => {
  dom.hideElementsBySelectors('.Calendar');
  document.querySelector(`.Calendar.month-${month}`).style.display = '';
}
