'use strict';

const test = require('tape');
const getAvailableDatesWithTimes = require('../../lib/calendar/getAvailableDatesWithTimes');
const datetime = require('../../lib/datetime/datetime');

// TODO: test using FakeXMLHttpRequest and tape-promise

test('get available dates with times', (assert) => {
  let availableDates =
  {
    "2016-02-05": {
      "calendar_id": "1229",
      "available_times_count": 6
    }
  };

  // where to use this? or maybe just check that Promise is created?
  let availableTimes = { "times": ["09:00", "12:00", "13:00", "13:20", "15:40"] };

  let expectedDatesWithTimes =
  {
    "2016-02-05": {
      "calendar_id": "1229",
      "available_times_count": 5,
      "available_times": ["09:00", "12:00", "13:00", "13:20", "15:40"]
    }
  };

  //let availableDatesWithTimes = getAvailableDateWithTimes(availableDates);
  //assert.deepEqual(availableDatesWithTimes, expectedDatesWithTimes);
  assert.end();
});
