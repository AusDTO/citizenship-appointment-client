'use strict';

require("babel-polyfill");

const calendar = require('./calendar/calendar');
const calendarRenderer = require('./calendar/calendarRenderer');
const router = require('./calendar/router');
const dom = require('./helpers/domHelpers');
const session_counter = require('./session/session_counter');
const modal_focus = require('./calendar/modal_focus');

let request = new XMLHttpRequest();
let previousFocus;

request.open('GET', '/get_available_dates.json');

request.onload = () => {
  if (request.status >= 200 && request.status < 300) {
    let availableDates = JSON.parse(request.responseText);
    let foo = calendar(availableDates, document.querySelector('.Calendars').getAttribute('data-today'));
    calendarRenderer(foo);
    if(window.location.hash) {
      router(null, foo, true)();
    }
    window.addEventListener("hashchange", (e) => { router(e, foo, false)(); });
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
  dom.addClass('#open-modal', 'modalDialog--display');
  document.getElementById('extend-session').focus();

  document.querySelector('.modalDialog-content').addEventListener('keydown', (e) => {
    modal_focus.trapFocus(document.querySelector('.modalDialog'), e);
  });

  document.getElementById('extend-session').addEventListener('click', () => {
    extendSession();
    window.location.hash = previousLocation;
    closeModal();
  });

  document.getElementById('close-modal').addEventListener('click', () => {
    closeModal();
  });
}

function closeModal() {
  dom.removeClass('#open-modal', 'modalDialog--display');
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
