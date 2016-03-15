'use strict';

const test = require('tape');
const path = require('path');
const moment = require('moment');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

const appointmentDate = moment().startOf('week').add(1, 'months');
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
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking');
      })
      .setValue('#clientId', '99999999999')
      .setValue('#familyName', 'Family-Name')
      .click('#submitLogin')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Calendar');
      })
      .waitForVisible(`[name="month/${monthLink}"]`, 30000)
      .click(`[name="month/${monthLink}"]`)
      .waitForVisible(`[name="date/${dateLink}"]`, 30000)
      .click(`[name="date/${dateLink}"]`)
      .waitForVisible(`[name="time/${timeLink}"]`, 30000)
      .click(`[name="time/${timeLink}"]`)
      .waitForVisible('.SelectionConfirmation-button', 30000)
      .click('.SelectionConfirmation-button')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Confirmation');
      })
      .click('.logout-link')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking');
      })
      .end();
});
