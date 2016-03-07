'use strict';

const datetime = require('../datetime/datetime');

module.exports = (bookableMonths, availableDates, todayDate) => {
  let months = [], weeks = [], timeslots_per_day=30;

  for (let month of bookableMonths) {
    let date = month.startOf('month').startOf('week');
    const endDate = month.endOf('month').endOf('week');

    let week;
    let dayData;

    for (let dayCount = 0; date.isBefore(endDate); date = date.add(1, 'days'), dayCount++) {

      if (dayCount % 7 === 0) {
        week = [];
        weeks.push({days: week});
      }

      dayData =
      {
        date: date.toDateString(),
        day: date.date(),
        ariaDay: date.ariaDisplayDate(),
        today: date.isSameDay(todayDate),
        available_times_count: (availableDates[date.toDateString()] && date.isSameDayOrAfter(todayDate)) ? availableDates[date.toDateString()].available_times_count : 0,
        bookable: date.isSameYearAndMonth(month),
        dateTabIndex: (dayCount + 2) * timeslots_per_day
      };

      week.push(dayData);
    }

    let monthData = { month: month.toMonthString(), monthName: month.monthName(), year: month.year(), weeks };

    let prevMonth = month.subtract(1, 'months');
    let nextMonth = month.add(1, 'months');
    if (prevMonth.isSameOrAfter(bookableMonths[0])) {
      monthData['prevMonth'] = prevMonth.toMonthString();
      monthData['prevMonthName'] = prevMonth.monthName();
      monthData['prevMonthYear'] = prevMonth.year();
    }
    if (nextMonth.isSameOrBefore(bookableMonths[bookableMonths.length-1])) {
      monthData['nextMonth'] = nextMonth.toMonthString();
      monthData['nextMonthName'] = nextMonth.monthName();
      monthData['nextMonthYear'] = nextMonth.year();
    }

    months.push(monthData);
    weeks = [];
  }

  return { months };
}
