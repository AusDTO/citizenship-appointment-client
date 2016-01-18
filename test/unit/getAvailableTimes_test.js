'use strict';

const test = require('tape');
const getAvailableTimes = require('../../lib/calendar/getAvailableTimes');
const datetime = require('../../lib/datetime/datetime');

// TODO: test using FakeXMLHttpRequest and tape-promise

test('get available times', (assert) => {
  let availableDates =
  {
    "2016-02-05": {
      "calendar_id": "1229",
      "available_times_count": 6
    }
  };

  let availableTimes = { "times": ["09:00", "12:00", "13:00", "13:20", "15:40"] };

  assert.end();
});
