'use strict';

const test = require('tape');
const path = require('path');
const client = require('./client')({
  testSuiteName: path.basename(__filename)
});

test('should visit Citizenship Appointment application', (assert) => {
  assert.plan(1);
  client
      .init()
      .url(client.baseUrl)
      .getTitle()
      .then((title) => {
        assert.equal(title, 'Citizenship Appointment Booking');
      })
      .saveScreenshot('snapshot.png')
      .end();
});
