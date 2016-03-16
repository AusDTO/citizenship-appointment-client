'use strict';

const session_counter = require('../session/session_counter');
const ga = require('ga');
const modal_popup = require('../helpers/modal_popup');

class CalendarSessionTimeoutHandler {

  setup(){
    this.session = session_counter();
    this.timeoutEventId = this.session.setTimeoutEvent(this.expireSession);

    this.session.setNotificationBeforeExpiry(this.sessionExpiryNotification);
  }

  expireSession() {
      window.location = "/session_timeout";
  }

  sessionExpiryNotification() {
    var.previousLocation = window.location.hash;
    var previousFocus = document.activeElement;
    var modal = modal_popup('#open-modal');
    modal.show();

    document.getElementById('extend-session').addEventListener('click', () => {
      ga('send', 'event', 'Calendar', 'extend_session');
      this.extendSession();
      window.location.hash = previousLocation;
      modal.closeModal();
      previousFocus.focus();
    }, null);
  }

  extendSession() {
    window.clearTimeout(this.timeoutEventId);
    request.open('GET', '/extend_session');
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        this.session.setNotificationBeforeExpiry(this.sessionExpiryNotification);
        this.timeoutEventId = this.session.setTimeoutEvent(this.expireSession);
      } else {
        window.location = "error";
      }
    };
    request.onerror = () => {
      window.location = "error";
    };
    request.send();
  }
}

module.exports = () => {
  return new CalendarSessionTimeoutHandler();
};