'use strict';

const $ = require('jquery'),
      moment = require('moment'),
      tmplRow = require('../views/client/bookingCalendar-tmplRow.mustache'),
      tmplDate = require('../views/client/bookingCalendar-tmplDate.mustache'),
      tmplDay = require('../views/client/slotpicker-tmplDay.mustache');

const defaults =  {
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  navPointer: 0
};

class SlotPicker {
  constructor(bookingData) {
    this.settings = defaults;
    this.settings.today = moment.utc();
    this.settings.bookingData = bookingData;
    this.settings.bookableDates = Object.keys(bookingData);
    this.bindEvents();
    this.settings.navMonths = this.setupNavMonths();
    this.updateNav();
    this.renderCalendar();
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

  updateNav() {
    if (this.settings.navPointer > 0) {
      $('.BookingCalendar-nav--prev').addClass('is-active');
    } else {
      $('.BookingCalendar-nav--prev').removeClass('is-active');
    }
    if (this.settings.navPointer + 1 < this.settings.navMonths.length) {
      $('.BookingCalendar-nav--next').addClass('is-active');
    } else {
      $('.BookingCalendar-nav--next').removeClass('is-active');
    }
  }

  renderCalendar() {
    for(let monthDate of this.settings.navMonths) {
      this.renderMonth(monthDate);
    }
    this.displayMonth(this.settings.navMonths[0].month());
  }

  renderMonth(monthDate) {
    let from = this.firstDayOfMonth(monthDate),
        to = this.lastDayOfMonth(monthDate);
    $('.BookingCalendar-datesBody').append(this.buildDates(tmplRow, tmplDate, from, to));
  }

  renderMonthLabel(month) {
    $('.BookingCalendar-currentMonth').text(this.settings.months[month]);
  }

  displayMonth(month) {
    $('.BookingCalendar-datesBody tr').hide();
    $('tr.CalRow.month-' + month).show();
    this.renderMonthLabel(month);
  }

  bindEvents() {
    $('button.BookingCalendar-nav--next').click((e) => {
      e.preventDefault();
      this.nudgeNav(1);
    });

    $('button.BookingCalendar-nav--prev').click((e) => {
      e.preventDefault();
      this.nudgeNav(-1);
    });
  }

  nudgeNav(i) {
    this.settings.navPointer = this.settings.navPointer + i;
    this.displayMonth(this.settings.navMonths[this.settings.navPointer].month());
    this.updateNav();
  }

  buildDates(templateRow, templateDate, from, to) {
    let out = '', row = '', curIso,
        displayAvailable='', dayStr = '',
        todayIso = this.formatIso(this.settings.today),
        count = 1,
        curDate = this.firstDayOfWeek(from),
        end = this.lastDayOfWeek(to);

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
        klass: className
      });

      if (count === 7) {
        out+= templateRow.render({
          month: from.month(),
          cells: row
        });
        row = '';
        count = 0;
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
