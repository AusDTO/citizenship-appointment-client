'use strict';

const test = require('tape');
const path = require('path');
const moment = require('moment');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

test('should successfully login and book appointment', (assert) => {
  assert.plan(4);
  client
      .init()
      .url(client.baseUrl)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking');
      })
      .setValue('#clientId', '01234567890')
      .setValue('#familyName', 'Familyname')
      .click('#submitLogin')
      .timeouts('page load',30000)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Australian Government - Citizenship Appointment Booking Calendar');
      })
      .waitForVisible('.Calendar-nav--next', 30000)
      .getAttribute('[class*="DateCell Calendar-date--unavailable  date-20"]', 'class').then(function(cells){
        var className = cells[0].match(/\d{4}-\d{2}-\d{2}/);
        var appointmentDate = moment(className, "YYYY-MM-DD").add(1, 'months');
        var monthLink = appointmentDate.format('YYYY-MM');

        var bookableDateSelector = '[class*="DateCell Calendar-date--bookable date-' + monthLink + '"]';

        client
          .waitForVisible(`[name="month/${monthLink}"]`, 30000)
          .click(`[name="month/${monthLink}"]`)
          .waitForVisible(bookableDateSelector, 30000)
          .getAttribute(bookableDateSelector, 'class').then(function(nextMonthCells){
              var dateLink = nextMonthCells[0].match(/\d{4}-\d{2}-\d{2}/);
              var availableTimesSelector = '[class="AvailableTimes date-' + dateLink + '"] a.AppointmentLink';

              client
                .click(`a[class="DateCell-content--datelink date-${dateLink}"]`)
                .waitForVisible(availableTimesSelector, 30000)
                .getAttribute(availableTimesSelector, 'name').then(function(timeLinks){
                    var firstTimeLink = timeLinks[0];
                    client
                      .click(`[name="${firstTimeLink}"]`)
                })
          })
      })
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
