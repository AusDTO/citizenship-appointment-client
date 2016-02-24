'use strict';

const mod = module.exports = {};
const KEYCODE_TAB = 9;

mod.trapFocus = (obj, evt) => {
  let focusableElements = [
    document.getElementById('log-out'),
    document.getElementById('extend-session'),
    document.getElementById('close-modal')];

  if ( evt.which == KEYCODE_TAB || evt.keyCode == KEYCODE_TAB ) {
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
