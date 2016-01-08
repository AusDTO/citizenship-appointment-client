'use strict';

const mod = module.exports = {};

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
