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
      .setValue('#clientId', '12345678911')
      .setValue('#familyName', 'soprano')
      .saveScreenshot('snapshot01-login.png')
      .click('#submitLogin')
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Calendar');
      })
      .click('[name="month/2016-02"]')
      .click('[name="date/2016-02-11"]')
      .timeoutsImplicitWait(10000)
      .click('[name="time/2016-02-11T15:00:00"]')
      .saveScreenshot('snapshot02-calendar.png')
      .click('.SelectionConfirmation-button')
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking Confirmation');
      })
      .saveScreenshot('snapshot03-confirmation.png')
      .end();

});
