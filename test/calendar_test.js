'use strict';

const test = require('tape');
const calendar = require('../lib/calendar');
const moment = require('moment');

test('bookable months', (assert) => {
  let data = calendar({
    "2015-12-04":{
       "calendar_id":"1228",
       "available_slots_count":6
    },
    "2016-02-05":{
       "calendar_id":"1229",
       "available_slots_count":6
    }
  });

  let expectedMonths = ['2015-12-01', '2016-01-01', '2016-02-01'];

  assert.deepEqual(data.getBookableMonths().map((bookableMonth)=>{return bookableMonth.format('YYYY-MM-DD')}), expectedMonths);
  assert.end();
});
