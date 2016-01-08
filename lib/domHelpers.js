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
