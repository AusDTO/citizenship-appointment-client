'use strict';

const test = require('tape');
const getCalendarStructure = require('../../lib/calendar/getCalendarStructure');
const datetime = require('../../lib/datetime/datetime');

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
                "date": "2015-11-30",
                "day": 30,
                "ariaDay": "Monday 30th November",
                "today": false,
                "available_times_count": 0,
                "bookable": false
              },
              {
                "date": "2015-12-01",
                "day": 1,
                "ariaDay": "Tuesday 1st December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-02",
                "day": 2,
                "ariaDay": "Wednesday 2nd December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-03",
                "day": 3,
                "ariaDay": "Thursday 3rd December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-04",
                "day": 4,
                "ariaDay": "Friday 4th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-05",
                "day": 5,
                "ariaDay": "Saturday 5th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-06",
                "day": 6,
                "ariaDay": "Sunday 6th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              }
            ]
          },
          {
            "days": [
              {
                "date": "2015-12-07",
                "day": 7,
                "ariaDay": "Monday 7th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-08",
                "day": 8,
                "ariaDay": "Tuesday 8th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-09",
                "day": 9,
                "ariaDay": "Wednesday 9th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-10",
                "day": 10,
                "ariaDay": "Thursday 10th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-11",
                "day": 11,
                "ariaDay": "Friday 11th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-12",
                "day": 12,
                "ariaDay": "Saturday 12th December",
                "today": true,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-13",
                "day": 13,
                "ariaDay": "Sunday 13th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              }
            ]
          },
          {
            "days": [
              {
                "date": "2015-12-14",
                "day": 14,
                "ariaDay": "Monday 14th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-15",
                "day": 15,
                "ariaDay": "Tuesday 15th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-16",
                "day": 16,
                "ariaDay": "Wednesday 16th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-17",
                "day": 17,
                "ariaDay": "Thursday 17th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-18",
                "day": 18,
                "ariaDay": "Friday 18th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-19",
                "day": 19,
                "ariaDay": "Saturday 19th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-20",
                "day": 20,
                "ariaDay": "Sunday 20th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              }
            ]
          },
          {
            "days": [
              {
                "date": "2015-12-21",
                "day": 21,
                "ariaDay": "Monday 21st December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-22",
                "day": 22,
                "ariaDay": "Tuesday 22nd December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-23",
                "day": 23,
                "ariaDay": "Wednesday 23rd December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-24",
                "day": 24,
                "ariaDay": "Thursday 24th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-25",
                "day": 25,
                "ariaDay": "Friday 25th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-26",
                "day": 26,
                "ariaDay": "Saturday 26th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-27",
                "day": 27,
                "ariaDay": "Sunday 27th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              }
            ]
          },
          {
            "days": [
              {
                "date": "2015-12-28",
                "day": 28,
                "ariaDay": "Monday 28th December",
                "today": false,
                "available_times_count": 6,
                "bookable": true
              },
              {
                "date": "2015-12-29",
                "day": 29,
                "ariaDay": "Tuesday 29th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-30",
                "day": 30,
                "ariaDay": "Wednesday 30th December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2015-12-31",
                "day": 31,
                "ariaDay": "Thursday 31st December",
                "today": false,
                "available_times_count": 0,
                "bookable": true
              },
              {
                "date": "2016-01-01",
                "day": 1,
                "ariaDay": "Friday 1st January",
                "today": false,
                "available_times_count": 0,
                "bookable": false
              },
              {
                "date": "2016-01-02",
                "day": 2,
                "ariaDay": "Saturday 2nd January",
                "today": false,
                "available_times_count": 0,
                "bookable": false
              },
              {
                "date": "2016-01-03",
                "day": 3,
                "ariaDay": "Sunday 3rd January",
                "today": false,
                "available_times_count": 0,
                "bookable": false
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
