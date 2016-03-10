'use strict';

const test = require('tape');
const path = require('path');
const moment = require('moment');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

const appointmentDate = moment();
const calendarId = 1268;
const dateLink = appointmentDate.format('YYYY-MM-DD');
const timeLink = '09:40';

test('should successfully login and book appointment using the flow with limited JavaScript', (assert) => {
  assert.plan(6);
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
      //Use for NoJS browsers
      // .click('.Old-Calendar-Needed-message a')
      // .timeouts('page load',30000)
      .waitForExist('[href*="/calendar/text/"]', 30000)
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Calendar - Select date');
      })
      //Go to text only Calendar
      .click('[href*="/calendar/text/"]')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Calendar - Select time');
      })
      //Go to times page
      .click('=9:40 AM')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Calendar - Confirm selection');
      })
      //Go to selection page
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
