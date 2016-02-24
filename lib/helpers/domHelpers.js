'use strict';

const mod = module.exports = {};

mod.addClass = (selectorString, className) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.classList ? el.classList.add(className) : el.className += ' ' + className;
  }
}

mod.removeClass = (selectorString, className) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.classList ?
        el.classList.remove(className) :
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

mod.hideElementsBySelectors = (selectorString) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.style.display = 'none';
  }
}

mod.clearHTML = (selectorString) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.innerHTML = '';
  }
}

mod.highlightDateCell = (dateString) => {
  mod.removeClass('.Calendar-date--bookable.is-active', 'is-active');
  mod.addClass(`.Calendar-date--bookable.date-${dateString}`, 'is-active');
}

mod.unhighlightDateCells = () => {
  mod.removeClass('.Calendar-date--bookable.is-active', 'is-active');
}

mod.highlightTimesCell = (datetimeClassString) => {
  mod.removeClass('.AppointmentTimes-list--item.is-active', 'is-active');
  mod.addClass(`.AppointmentTimes-list--item.datetime-${datetimeClassString}`, 'is-active');
};

mod.renderSystemError = (selectorString) => {
  let el = document.querySelector(selectorString);
  el.innerHTML = 'An error has occurred in the system. Please try again in a few minutes';
}

mod.focusFirstActiveMonthDate = (month) => {
  let elems = document.querySelectorAll("[class^='DateCell Calendar-date--bookable date-"+ month +"'] a");
  if(elems.length > 0) {
    elems[0].focus();
  }
}
