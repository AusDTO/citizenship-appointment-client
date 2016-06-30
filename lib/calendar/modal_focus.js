'use strict';

const mod = module.exports = {};
const KEYCODE_TAB = 9;

mod.trapFocus = (obj, evt) => {
  let focusableElements = [];
  let elementIds = ['log_out', 'extend_session', 'close_modal'];
  for (let elId of elementIds) {
    let el = document.getElementById(elId);
    if (el != null) {
      focusableElements.push(el);
    }
  }

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
