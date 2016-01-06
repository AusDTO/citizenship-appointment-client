'use strict';

const moment = require('moment');
const asMoment = Symbol('asMoment');

moment.locale('en-au');

class Datetime {
  constructor (input) {
    this.datetime = (typeof input === 'string') ? moment.utc(input) : moment(input);
  }

  toDateTimeString() {
    return this.datetime.format('YYYY-MM-DDTHH:mm:SS');
  }

  toDateString() {
    return this.datetime.format('YYYY-MM-DD');
  }

  toMonthString() {
    return this.datetime.format('YYYY-MM');
  }

  isSameYearAndMonth(that) {
    return this.toMonthString() === that.toMonthString();
  }

  [asMoment]() {
    return moment(this.datetime);
  }

};

['set', 'add'].forEach((member) => {
  Datetime.prototype[member] = function() {
    return new Datetime(this[asMoment]()[member](...arguments));
  }
});

['day'].forEach((member) => {
  Datetime.prototype[member] = function() {
    if (arguments.length > 0) {
      return new Datetime(this[asMoment]()[member](...arguments));
    } else {
      return this[asMoment]()[member]();
    }
  }
});

module.exports = (input) => {
  return new Datetime(input);
};
