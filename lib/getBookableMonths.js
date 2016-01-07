'use strict';

const datetime = require('./datetime');

module.exports = (availableDates) => {
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
