'use strict';

const test = require('tape');
const path = require('path');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

test('should successfully login and book appointment', (assert) => {
  assert.plan(3);
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
      .timeouts('page load',5000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Calendar');
      })
      .click('[name="month/2016-02"]')
      .click('[name="date/2016-02-11"]')
      .waitForVisible('[name="time/2016-02-11T15:00:00"]', 10000)
      .click('[name="time/2016-02-11T15:00:00"]')
      .click('.SelectionConfirmation-button')
      .timeouts('page load',5000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Confirmation');
      })
      .end();

});
