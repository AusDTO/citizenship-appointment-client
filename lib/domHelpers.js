'use strict';

const mod = module.exports = {};

mod.addClassToElements = (selectorString, className) => {
  let elements = document.querySelectorAll(selectorString);
  for (let el of elements) {
    el.classList ? el.classList.add(className) : el.className += ' ' + className;
  }
}

mod.removeClassFromElements = (selectorString, className) => {
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

mod.clearSelection = () => {
  mod.hideElementsBySelectors('.SelectionConfirmation');
  let elements = document.querySelectorAll('.SelectionConfirmationCell');
  for (let el of elements) {
    el.innerHTML = '';
  }
}

mod.highlightDateCell = (dateString) => {
  mod.removeClassFromElements('.Calendar-date--bookable.is-active', 'is-active');
  mod.addClassToElements(`.Calendar-date--bookable.date-${dateString}`, 'is-active');
}

mod.highlightTimesCell = (datetimeClassString) => {
  mod.removeClassFromElements('.AppointmentTimes-list--item.is-active', 'is-active');
  mod.addClassToElements(`.AppointmentTimes-list--item.datetime-${datetimeClassString}`, 'is-active');
};
