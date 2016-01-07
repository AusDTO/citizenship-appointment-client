'use strict';

const datetime = require('./datetime');

const mod = module.exports = {};

mod.getBookableMonths = (availableDates) => {
  let bookableMonths = [];

  let dates = Object.keys(availableDates);
  let firstDateAsString = dates[0];
  let lastDateAsString = dates[dates.length - 1];

  let date = datetime(firstDateAsString);
  let lastDate = datetime(lastDateAsString);

  for (; date.toMonthString() <= lastDate.toMonthString(); date = date.add(1, 'months')) {
    bookableMonths.push(date.set('date', 1));
  }
  return bookableMonths;
}

mod.getCalendarStructure = (bookableMonths, availableDates) => {
  let months = [], weeks = [];
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
        available_times_count: availableDates[date.toDateString()] ? availableDates[date.toDateString()].available_times_count : 0
      });
    }

    let monthData = { month: month.toMonthString(), monthName: month.monthName(), weeks };

    // eewwwww
    let prevMonth = month.subtract(1, 'months');
    let nextMonth = month.add(1, 'months');
    if (prevMonth.isSameOrAfter(bookableMonths[0])) {
      monthData['prevMonth'] = prevMonth.toMonthString();
    }
    if (nextMonth.isSameOrBefore(bookableMonths[bookableMonths.length-1])) {
      monthData['nextMonth'] = nextMonth.toMonthString();
    }
    //eewwwww

    months.push(monthData);
    weeks = [];
  }

  return {months};
}
