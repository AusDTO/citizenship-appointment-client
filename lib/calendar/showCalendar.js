'use strict';

const dom = require('../helpers/domHelpers');

module.exports = (month) => {
  dom.unhighlightCalendarDates();
  dom.toggleHideOn('.appointment-section');
  let element = document.querySelector(`.Calendar.month-${month}`);
  if (!element) { return; }
  dom.hideElementsBySelectors('.Calendar');
  element.style.display = '';

  //if CSS disabled, go to the text version of the calendar
  let calendarDates = document.getElementsByClassName('calendar-date');
  if(calendarDates.length > 0){
    if("block" === window.getComputedStyle(calendarDates[0], "").display){
      window.location = '/calendar/text';
      return true;
    }
  }
}
