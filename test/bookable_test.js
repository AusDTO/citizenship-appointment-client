'use strict';

const test = require('tape');
const bookable = require('../lib/bookable');
const datetime = require('../lib/datetime');

test('bookable months', (assert) => {
    let bookableMonths = bookable({
        "2015-12-04":{
            "calendar_id":"1228",
            "available_slots_count":6
        },
        "2016-02-05":{
            "calendar_id":"1229",
            "available_slots_count":6
        }
    });

    let expectedMonths = ['2015-12', '2016-01', '2016-02'];

    assert.deepEqual(bookableMonths.map((bookableMonth)=>{return bookableMonth.toMonthString()}), expectedMonths);
    assert.end();
});
