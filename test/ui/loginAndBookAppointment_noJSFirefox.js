'use strict';

const test = require('tape');
const path = require('path');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

test('should successfully login and book appointment using the flow without JavaScript', (assert) => {
  assert.plan(7);
  client.addCommand("disableJavascriptInFirefox", function(customVar) {
    return this
      .url("about:config")
      .waitForEnabled("#warningButton", 20000)
      .click("#warningButton")
      .isEnabled('#textbox').then(function() {
        console.log("Changing Firefox profile settings to not use JS");
      })
      .keys("/^javascript.enabled/")
      .pause(1000)
      .keys("\u0009")
      .keys("\u000D").then(function() {
        console.log("Finished changing Firefox profile settings to not use JS");
      })
    });

  client
      .init()
      .disableJavascriptInFirefox()
      .url(client.baseUrl)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Login');
      })
      .setValue('#clientId', '99999999999')
      .setValue('#familyName', 'Family-Name')
      .click('#submitLogin')
      //Go to standard calendar page
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Calendar');
      })
      //Go to text only Calendar
      .click('.Old-Calendar-Needed-message a')
      .timeouts('page load',30000)
      .waitForExist('[href*="/calendar/text/"]', 30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Select Date');
      })
      .click('[href*="/calendar/text/"]')
      .timeouts('page load',30000)
      .waitForExist('[href*="/calendar/text/20"]', 30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking - Select Time');
      })
      //Go to times page
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
      //Go to selection page
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
