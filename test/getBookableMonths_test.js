'use strict';

const test = require('tape');
const getBookableMonths = require('../lib/getBookableMonths');
const datetime = require('../lib/datetime');

test('get bookable months', (assert) => {
  let availableDates =
  {
    "2015-12-04": {
      "calendar_id": "1228",
      "available_times_count": 6
    },
    "2016-02-05": {
      "calendar_id": "1229",
      "available_times_count": 6
    }
  };

  let expectedMonths = ['2015-12', '2016-01', '2016-02'];

  let bookableMonths = getBookableMonths(availableDates);

  assert.deepEqual(bookableMonths.map((bookableMonth)=> {
    return bookableMonth.toMonthString()
  }), expectedMonths);
  assert.end();
});

