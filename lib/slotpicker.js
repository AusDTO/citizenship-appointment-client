'use strict';

const $ = require('jquery'),
      moment = require('moment'),
      tmplRow = require('../views/client/bookingCalendar-tmplRow.mustache'),
      tmplDate = require('../views/client/bookingCalendar-tmplDate.mustache'),
      tmplDay = require('../views/client/slotpicker-tmplDay.mustache');

const defaults =  {
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December']
};

class SlotPicker {
  constructor(bookingData) {
    this.settings = defaults;
    this.settings.today = moment.utc();
    this.settings.bookingData = bookingData;
    this.settings.bookableDates = Object.keys(bookingData);
    this.settings.navMonths = this.setupNavMonths();
    this.renderCalendar(tmplRow, tmplDate, tmplDay);
  }

  setupNavMonths() {
    let bookableMonths = [];
    let prevMonth = '', curDate;
    for (let date in this.settings.bookingData) {
      curDate = moment.utc(date);
      if(curDate.month() !== prevMonth) {
        bookableMonths.push(curDate);
        prevMonth = curDate.month();
      }
    }
    console.log(bookableMonths);
    return bookableMonths;
  }

  renderCalendar(tmplRow, tmplDate, tmplDay) {
    this.renderMonth(tmplRow, tmplDate, tmplDay, this.settings.navMonths[0]);
  }

  renderMonth(tmplRow, tmplDate, tmplDay, monthDate) {
    let from = this.firstDayOfMonth(monthDate),
        to = this.lastDayOfMonth(monthDate);

    $('.BookingCalendar-datesBody').append(this.buildDates(tmplRow, tmplDate, from, to));
    $('.BookingCalendar-currentMonth').text(this.settings.months[from.month()]);
  };

  buildDates(templateRow, templateDate, from, to) {
    let out = '', row = '', curIso,
        displayAvailable='', dayStr = '',
        todayIso = this.formatIso(this.settings.today),
        count = 1,
        curDate = this.firstDayOfWeek(from),
        end = this.lastDayOfWeek(to);

    let rowNum = 0;

    while (curDate <= end) {
      dayStr = this.settings.days[curDate.day()];
      curIso = this.formatIso(curDate);

      let className = this.dateBookable(curDate, this.settings.bookableDates) ? 'BookingCalendar-date--bookable' : 'BookingCalendar-date--unavailable';
      if (curDate < from || curDate > to) {
        className += ' BookingCalendar-date--hide';
      }

      let bookable = this.settings.bookingData[this.formatIso(curDate)];
      if(bookable) {
        displayAvailable = bookable.vacant_slots + ' available';
      } else {
        displayAvailable='';
      }

      row+= templateDate.render({
        date: curIso,
        day: curDate.date(),
        available: displayAvailable,
        today: curIso === todayIso,
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

  firstDayOfMonth(date) {
    return moment.utc(date).startOf('month');
  }

  lastDayOfWeek(date) {
    return moment.utc(date).endOf('week');
  }

  lastDayOfMonth(date) {
    return moment.utc(date).endOf('month');
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

module.exports = (bookingData) => {
  return new SlotPicker(bookingData);
};
