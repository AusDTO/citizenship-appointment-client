'use strict';

const test = require('tape');
const getCalendarStructure = require('../../lib/getCalendarStructure');
const datetime = require('../../lib/datetime');

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

  let todayDate = datetime('2015-12-12');

  let calendarStructure = getCalendarStructure(bookableMonths, availableDates, todayDate);

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
                today: false,
                day: 30,
                available_times_count: 0,
                bookable: false
              },
              {
                date: "2015-12-01",
                today: false,
                day: 1,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-02",
                today: false,
                day: 2,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-03",
                today: false,
                day: 3,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-04",
                today: false,
                day: 4,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-05",
                today: false,
                day: 5,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-06",
                today: false,
                day: 6,
                available_times_count: 0,
                bookable: true
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-07",
                today: false,
                day: 7,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-08",
                today: false,
                day: 8,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-09",
                today: false,
                day: 9,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-10",
                today: false,
                day: 10,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-11",
                today: false,
                day: 11,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-12",
                today: true,
                day: 12,
                available_times_count: "Spots",
                bookable: true
              },
              {
                date: "2015-12-13",
                today: false,
                day: 13,
                available_times_count: 0,
                bookable: true
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-14",
                today: false,
                day: 14,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-15",
                today: false,
                day: 15,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-16",
                today: false,
                day: 16,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-17",
                today: false,
                day: 17,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-18",
                today: false,
                day: 18,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-19",
                today: false,
                day: 19,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-20",
                today: false,
                day: 20,
                available_times_count: 0,
                bookable: true
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-21",
                today: false,
                day: 21,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-22",
                today: false,
                day: 22,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-23",
                today: false,
                day: 23,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-24",
                today: false,
                day: 24,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-25",
                today: false,
                day: 25,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-26",
                today: false,
                day: 26,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-27",
                today: false,
                day: 27,
                available_times_count: 0,
                bookable: true
              }
            ]
          },
          {
            days: [
              {
                date: "2015-12-28",
                today: false,
                day: 28,
                available_times_count: 6,
                bookable: true
              },
              {
                date: "2015-12-29",
                today: false,
                day: 29,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-30",
                today: false,
                day: 30,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2015-12-31",
                today: false,
                day: 31,
                available_times_count: 0,
                bookable: true
              },
              {
                date: "2016-01-01",
                today: false,
                day: 1,
                available_times_count: 0,
                bookable: false
              },
              {
                date: "2016-01-02",
                today: false,
                day: 2,
                available_times_count: 0,
                bookable: false
              },
              {
                date: "2016-01-03",
                today: false,
                day: 3,
                available_times_count: 0,
                bookable: false
              }
            ]
          }
        ]
      }
    ]
  }

  assert.deepEqual(calendarStructure, expectedStructure);
  assert.end();
})
;
