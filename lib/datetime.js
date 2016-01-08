'use strict';

const moment = require('moment');

moment.locale('en-au');

class Datetime {
  constructor(input) {
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

  monthName() {
    return this.datetime.format('MMMM');
  }

  displayTime() {
    return this.datetime.format('h:mm');
  }

  displayDate() {
    return this.datetime.format('dddd DD MMMM');
  }

  amPm() {
    return this.datetime.format('A');
  }

  isSameYearAndMonth(that) {
    return this.toMonthString() === that.toMonthString();
  }

  isSameDay(that) {
    return this.toDateString() === that.toDateString();
  }

  asMoment() {
    return moment(this.datetime);
  }

};

['set', 'add', 'subtract', 'startOf', 'endOf'].forEach((member) => {
  Datetime.prototype[member] = function () {
    return new Datetime(this.asMoment()[member](...arguments));
  }
});

['isBefore', 'isAfter', 'isSameOrBefore', 'isSameOrAfter'].forEach((member) => {
  Datetime.prototype[member] = function (that) {
    return this.datetime[member](that.asMoment());
  }
});

['toISOString'].forEach((member) => {
  Datetime.prototype[member] = function () {
    return this.datetime[member]();
  }
});

['date', 'week', 'month', 'year'].forEach((member) => {
  Datetime.prototype[member] = function () {
    if (arguments.length > 0) {
      return new Datetime(this.asMoment()[member](...arguments));
    } else {
      return this.asMoment()[member]();
    }
  }
});

module.exports = (input) => {
  return new Datetime(input);
};
