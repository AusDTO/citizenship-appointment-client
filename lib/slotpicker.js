'use strict';

const $ = require('jquery'),
      moment = require('moment'),
      tmplRow = require('../views/client/bookingCalendar-tmplRow.mustache'),
      tmplDate = require('../views/client/bookingCalendar-tmplDate.mustache'),
      tmplDay = require('../views/client/slotpicker-tmplDay.mustache');

const defaults =  {
  bookableDates: [],
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December']
};

class SlotPicker {
  constructor() {
    this.settings = defaults;
    this.settings.today = moment.utc();
    this.renderElements(tmplRow, tmplDate, tmplDay);
  }

  renderElements(tmplRow, tmplDate, tmplDay) {
    let from = moment.utc("2015-12-01"),
        to = moment.utc("2015-12-31");

    $('.BookingCalendar-datesBody').append(this.buildDates(tmplRow, tmplDate, from, to));
    $('.BookingCalendar-currentMonth').text(this.settings.months[from.month()]);
  }

  buildDates(templateRow, templateDate, from, to) {
    let out = '', row = '', curIso,
        today = this.settings.today,
        count = 1,
        curDate = this.firstDayOfWeek(from),
        end = this.lastDayOfWeek(this.lastDayOfMonth(to));

    var rowNum = 0;

    while (curDate <= end) {
      var displayAvailable = '',
          dayStr = this.settings.days[curDate.day()];

      var className = this.dateBookable(curDate, this.settings.bookableDates) ? 'BookingCalendar-date--bookable' : 'BookingCalendar-date--unavailable';
      if (curDate < from || curDate > to) {
        className += ' BookingCalendar-date--hide';
      }

      row+= templateDate.render({
        date: this.formatIso(curDate),
        day: curDate.date(),
        today: this.formatIso(curDate) === this.formatIso(today),
        newMonth: curDate.date() === 1,
        klass: className
      });

      if (count === 7) {
        out+= templateRow.render({
          rowId: rowNum,
          cells: row
        });
        row = '';
        count = 0;
        rowNum++;
      }

      curDate.date(curDate.date() + 1);
      count++;
    }

    return out;
  }

  firstDayOfWeek(date) {
    return moment.utc(date).startOf('week');
  }

  lastDayOfMonth(date) {
    return moment.utc(date).endOf('month');
  }

  lastDayOfWeek(date) {
    return moment.utc(date).endOf('week');
  }

  // HELPERS

  formatIso(date) {
    return date.format("YYYY-MM-DD");
  }

  indexOf(array, obj) {
    for (var i = 0, j = array.length; i < j; i++) {
      if (array[i] === obj) { return i; }
    }
    return -1;
  }

  dateBookable(date, dates) {
    return !!~this.indexOf(dates, this.formatIso(date));
  }

};

module.exports = () => {
  return new SlotPicker();
};
