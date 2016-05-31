'use strict';

const modal_focus = require('../calendar/modal_focus');
const dom = require('./domHelpers');

const KEYCODE_ESC = 27;

class ModalPopup {
  constructor(popupDOMid) {
    this.popupDOMid = popupDOMid;
  }

  show(){
	window.location.hash = this.popupDOMid;
	dom.addClass(this.popupDOMid, 'modalDialog-bg--display');
	dom.addClass('body', 'scroll-disabled');
	this.setEventListeners();

	document.querySelector('div' + this.popupDOMid + ' .log-out').focus();
  }

  setEventListeners(){
  	// document.querySelector('.modalDialog-content').addEventListener('keydown', (e) => {
  	window.addEventListener('keydown', (e) => {
		if ( e.which == KEYCODE_ESC || e.keyCode == KEYCODE_ESC ) {
		  this.closeModal();
		} else {
		  modal_focus.trapFocus(document.querySelector('.modalDialog-bg'), e);
		}
	}, null);

	document.querySelector(this.popupDOMid + ' .close').addEventListener('click', () => {
	  this.closeModal();
	});
  }

  closeModal() {
	  dom.removeClass(this.popupDOMid, 'modalDialog-bg--display');
	  dom.removeClass('body', 'scroll-disabled');
    location.hash = '#close-modal';
  }
}

module.exports = (popupDOMid) => {
  return new ModalPopup(popupDOMid);
};
