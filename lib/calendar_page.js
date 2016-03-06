'use strict';

require("babel-polyfill");

const calendar = require('./calendar/calendar');
const calendarRenderer = require('./calendar/calendarRenderer');
const router = require('./calendar/router');
const dom = require('./helpers/domHelpers');
const session_counter = require('./session/session_counter');
const modal_focus = require('./calendar/modal_focus');
const ga = require('ga');

const KEYCODE_ESC = 27;

let request = new XMLHttpRequest();
let previousFocus;

if (navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'none';
}

request.open('GET', '/get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
    let availableDates = JSON.parse(request.responseText);
    let foo = calendar(availableDates, document.querySelector('.Calendars').getAttribute('data-today'));
    calendarRenderer(foo);
    if(window.location.hash) {
      router(foo, true)();
    }
    window.addEventListener("hashchange", (e) => { router(foo, false)(); });
  } else {
    window.location = "error";
  }
};

request.onerror = () => {
  dom.renderSystemError('.calendar-page--main');
};

request.send();

/*BEGIN: handle session timeout*/
let session = session_counter();
let previousLocation = window.location.hash;
let timeoutEventId = session.setTimeoutEvent(expireSession);

function expireSession() {
    window.location = "/session_timeout";
}

function sessionExpiryNotification() {
  previousLocation = window.location.hash;
  previousFocus = document.activeElement;

  // display modal
  window.location.hash = '#open-modal';
  dom.addClass('#open-modal', 'modalDialog-bg--display');
  dom.addClass('body', 'scroll-disabled');
  document.getElementById('log-out').focus();

  document.querySelector('.modalDialog-content').addEventListener('keydown', (e) => {
    if ( e.which == KEYCODE_ESC || e.keyCode == KEYCODE_ESC ) {
      closeModal();
    } else {
      modal_focus.trapFocus(document.querySelector('.modalDialog-bg'), e);
    }
  });

  document.getElementById('extend-session').addEventListener('click', () => {
    ga('send', 'event', 'Calendar', 'extend_session');
    extendSession();
    window.location.hash = previousLocation;
    closeModal();
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    closeModal();
  });
}

function closeModal() {
  dom.removeClass('#open-modal', 'modalDialog-bg--display');
  dom.removeClass('body', 'scroll-disabled');
  previousFocus.focus();
}

function extendSession() {
  window.clearTimeout(timeoutEventId);
  request.open('GET', '/extend_session');
  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      session.setNotificationBeforeExpiry(sessionExpiryNotification);
      timeoutEventId = session.setTimeoutEvent(expireSession);
    } else {
      window.location = "error";
    }
  };
  request.onerror = () => {
    window.location = "error";
  };
  request.send();
}

session.setNotificationBeforeExpiry(sessionExpiryNotification);

/*END: handle session timeout*/
