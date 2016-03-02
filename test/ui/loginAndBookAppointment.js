'use strict';

const test = require('tape');
const path = require('path');
const moment = require('moment');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

const appointmentDate = moment().add(1, 'months').day() ? moment().add(1, 'months') : moment().add(1, 'months').add(2, 'days');
const monthLink = appointmentDate.format('YYYY-MM');
const dateLink = appointmentDate.format('YYYY-MM-DD');
const timeLink = appointmentDate.format('YYYY-MM-DD') + 'T15:00:00';

test('should successfully login and book appointment', (assert) => {
  assert.plan(4);
  client
      .init()
      .url(client.baseUrl)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking');
      })
      .setValue('#clientId', '99999999999')
      .setValue('#familyName', 'Family-Name')
      .click('#submitLogin')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Calendar');
      })
      .click(`[name="month/${monthLink}"]`)
      .click(`[name="date/${dateLink}"]`)
      .waitForVisible(`[name="time/${timeLink}"]`, 30000)
      .click(`[name="time/${timeLink}"]`)
      .click('.SelectionConfirmation-button')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Confirmation');
      })
      .click('.logout-link')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking');
      })
      .end();
});
