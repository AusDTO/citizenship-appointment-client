'use strict';

const dom = require('../helpers/domHelpers');

module.exports = (month) => {
  dom.unhighlightDateCells();
  dom.hideElementsBySelectors('.AvailableTimes');
  let element = document.querySelector(`.Calendar.month-${month}`);
  if (!element) { return; }
  dom.hideElementsBySelectors('.Calendar');
  element.style.display = '';

  //if CSS disabled, go to the text version of the calendar
  let dateCells = document.getElementsByClassName('DateCell');
  if(dateCells.length > 0){
    if("block" === window.getComputedStyle(dateCells[0], "").display){
      window.location = '/calendar/text';
      return true;
    }
  }
}
