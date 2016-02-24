'use strict';

const mod = module.exports = {};

mod.trapFocus = (obj, evt) => {
  let focusableElements = [
    document.getElementById('extend-session'),
    document.getElementById('log-out'),
    document.getElementById('close-modal')];

  if ( evt.which == 9 ) {
    let modalElements = obj.querySelectorAll('*');
    let numFocusableElements = focusableElements.length;
    let focusedElement = document.activeElement;
    let focusedElementIndex = focusableElements.indexOf(focusedElement);

    if (evt.shiftKey) {
      if( focusedElementIndex == 0 ){
        focusableElements[numFocusableElements-1].focus();
        evt.preventDefault();
      }
    } else {
      if( focusedElementIndex == numFocusableElements-1 ){
        focusableElements[0].focus();
        evt.preventDefault();
      }
    }
  }
};
