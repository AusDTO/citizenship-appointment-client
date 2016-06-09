'use strict';

const test = require('tape');
const path = require('path');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

test('should successfully login and book appointment using the flow with limited JavaScript', (assert) => {
  assert.plan(6);
  client
      .init()
      .url(client.baseUrl)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Login');
      })
      .setValue('#clientId', '99999999999')
      .setValue('#familyName', 'Family-Name')
      .click('#submitLogin')
      // Redirected to Old Calendar by default
      .timeouts('page load',30000)
      .waitForExist('[href*="/calendar/text/"]', 30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Select Date');
      })
      // Go to times page
      .click('[href*="/calendar/text/"]')
      .timeouts('page load',30000)
      .waitForExist('[href*="/calendar/text/20"]', 30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Select Time');
      })
      //Go to selection confirmation
      .getAttribute('[href*="/calendar/text/20"]', 'href').then(function(links){
        var timeLink = links[0].match(/\/calendar\/text\/\d{4}-\d{2}-\d{2}\/\d{2}:\d{2}/);
        client.click(`[href*="${timeLink}"]`)
      })
      .timeouts('page load',30000)
      .waitForExist('#submitCalendar', 30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Confirm Selection');
      })
      //Go to confirmation page
      .click('#submitCalendar')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Appointment Confirmation');
      })
      .click('.logout-link')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Login');
      })
      .end();
});
