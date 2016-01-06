'use strict';

const moment = require('moment');

moment.locale('en-au');

module.exports = (availableDates) => {
  let bookableMonths = [];

  let dates = Object.keys(availableDates);

  let firstDateAsString = dates[0];
  let lastDateAsString = dates[dates.length-1];

  let date = moment.utc(firstDateAsString);
  let lastDate = moment.utc(lastDateAsString);

  for(; date.format('YYYY-MM') <= lastDate.format('YYYY-MM'); date = moment(date).add(1, 'months')) {
    bookableMonths.push(date.set('date', 1));
  }

  return {
    getBookableMonths: () => {
      return bookableMonths;
    }
  };
}
