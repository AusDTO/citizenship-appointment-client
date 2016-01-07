'use strict';

const test = require('tape');
const getCalendarStructure = require('../lib/getCalendarStructure');
const datetime = require('../lib/datetime');

test('get calendar structure', (assert) => {
  let bookableMonths = [datetime('2015-12')];

  let availableDates =
  {
    "2015-12-04": {
      "calendar_id": "1228",
      "available_times_count": 20
    },
    "2015-12-28": {
      "calendar_id": "1229",
      "available_times_count": 6
    }
  };

  let calendarStructure = getCalendarStructure(bookableMonths, availableDates);

  let expectedStructure =
  {
    "months": [
      {
        "month": "2015-12",
        "monthName": "December",
        "weeks": [
          {
            "days": [
              {
                date: "2015-11-30",
                day: 30,
                available_times_count: 0
              },
              {
                date: "2015-12-01",
                day: 1,
                available_times_count: 0
              },
              {
                date: "2015-12-02",
                day: 2,
                available_times_count: 0
              },
              {
                date: "2015-12-03",
                day: 3,
                available_times_count: 0
              },
              {
                date: "2015-12-04",
                day: 4,
                available_times_count: 20
              },
              {
                date: "2015-12-05",
                day: 5,
                available_times_count: 0
              },
              {
                date: "2015-12-06",
                day: 6,
                available_times_count: 0
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-07",
                day: 7,
                available_times_count: 0
              },
              {
                date: "2015-12-08",
                day: 8,
                available_times_count: 0
              },
              {
                date: "2015-12-09",
                day: 9,
                available_times_count: 0
              },
              {
                date: "2015-12-10",
                day: 10,
                available_times_count: 0
              },
              {
                date: "2015-12-11",
                day: 11,
                available_times_count: 0
              },
              {
                date: "2015-12-12",
                day: 12,
                available_times_count: 0
              },
              {
                date: "2015-12-13",
                day: 13,
                available_times_count: 0
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-14",
                day: 14,
                available_times_count: 0
              },
              {
                date: "2015-12-15",
                day: 15,
                available_times_count: 0
              },
              {
                date: "2015-12-16",
                day: 16,
                available_times_count: 0
              },
              {
                date: "2015-12-17",
                day: 17,
                available_times_count: 0
              },
              {
                date: "2015-12-18",
                day: 18,
                available_times_count: 0
              },
              {
                date: "2015-12-19",
                day: 19,
                available_times_count: 0
              },
              {
                date: "2015-12-20",
                day: 20,
                available_times_count: 0
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-21",
                day: 21,
                available_times_count: 0
              },
              {
                date: "2015-12-22",
                day: 22,
                available_times_count: 0
              },
              {
                date: "2015-12-23",
                day: 23,
                available_times_count: 0
              },
              {
                date: "2015-12-24",
                day: 24,
                available_times_count: 0
              },
              {
                date: "2015-12-25",
                day: 25,
                available_times_count: 0
              },
              {
                date: "2015-12-26",
                day: 26,
                available_times_count: 0
              },
              {
                date: "2015-12-27",
                day: 27,
                available_times_count: 0
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-28",
                day: 28,
                available_times_count: 6
              },
              {
                date: "2015-12-29",
                day: 29,
                available_times_count: 0
              },
              {
                date: "2015-12-30",
                day: 30,
                available_times_count: 0
              },
              {
                date: "2015-12-31",
                day: 31,
                available_times_count: 0
              },
              {
                date: "2016-01-01",
                day: 1,
                available_times_count: 0
              },
              {
                date: "2016-01-02",
                day: 2,
                available_times_count: 0
              },
              {
                date: "2016-01-03",
                day: 3,
                available_times_count: 0
              }
            ]
          }
        ]
      }
    ]
  }

  assert.deepEqual(JSON.stringify(calendarStructure), JSON.stringify(expectedStructure));
  assert.end();
})
;
