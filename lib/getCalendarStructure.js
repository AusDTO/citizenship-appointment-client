'use strict';

const datetime = require('./datetime');

module.exports = (bookableMonths, availableDates) => {
  let months = [], weeks = [];
  const today = datetime();

  for (let month of bookableMonths) {
    let date = month.startOf('month').startOf('week');
    const endDate = month.endOf('month').endOf('week');

    let week;
    for (let dayCount = 0; date.isBefore(endDate); date = date.add(1, 'days'), dayCount++) {

      if (dayCount % 7 === 0) {
        week = [];
        weeks.push({days: week});
      }

      week.push({
        date: date.toDateString(),
        day: date.date(),
        today: date.isSameDay(today),
        available_times_count: availableDates[date.toDateString()] ? availableDates[date.toDateString()].available_times_count : 0,
        bookable: date.isSameYearAndMonth(month)
      });
    }

    let monthData = { month: month.toMonthString(), monthName: month.monthName(), weeks };

    let prevMonth = month.subtract(1, 'months');
    let nextMonth = month.add(1, 'months');
    if (prevMonth.isSameOrAfter(bookableMonths[0])) {
      monthData['prevMonth'] = prevMonth.toMonthString();
    }
    if (nextMonth.isSameOrBefore(bookableMonths[bookableMonths.length-1])) {
      monthData['nextMonth'] = nextMonth.toMonthString();
    }

    months.push(monthData);
    weeks = [];
  }

  return { months };
}
