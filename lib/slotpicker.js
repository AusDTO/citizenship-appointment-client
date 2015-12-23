'use strict';

const $ = require('jquery'),
      moment = require('moment'),
      tmplRow = require('../views/client/bookingCalendar-tmplRow.mustache'),
      tmplDate = require('../views/client/bookingCalendar-tmplDate.mustache'),
      tmplDay = require('../views/client/slotpicker-tmplDay.mustache');

moment.locale('en-au');

const defaults =  {
  days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'],
  months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  navPointer: 0
};

class SlotPicker {
  constructor(bookingData) {
    this.settings = defaults;
    this.settings.today = moment.utc();
    this.settings.bookableDates = Object.keys(bookingData);
    for(let date of this.settings.bookableDates) {
        bookingData[date].availableTimes = new Promise( function (resolve, reject) {
          let request = new XMLHttpRequest();
          request.open('GET', `get_available_times?date=${date}`);
          request.onload = () => {
            if (request.status === 200) {
              let availableTimes = JSON.parse(request.responseText).times;
              resolve(availableTimes);
            } else {
              reject(request.statusText);
            }
          };
          request.onerror = () => {
            reject("There was a problem sending the request.");
          };
          request.send();
        });
    }
    this.settings.bookingData = bookingData;
    this.settings.navMonths = this.setupNavMonths();
    this.updateNav();
    this.renderCalendar();
    this.bindEvents();
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
    var self = this;
    $('button.BookingCalendar-nav--next').click(() => {
      self.nudgeNav(1);
    });

    $('button.BookingCalendar-nav--prev').click(() => {
      self.nudgeNav(-1);
    });

    $('.BookingCalendar-dateLink').click(function() {
      self.highlightDate($( this ));
      let week = $(this).closest('tr').attr('data-week');
      let date = $(this).attr('data-date');
      document.querySelector(`tr.CalRow-slots[data-week='${week}']`).style.display='table-row';
      self.settings.bookingData[date].availableTimes.then((availableTimes) => {
        document.querySelector(`tr.CalRow-slots[data-week='${week}'] ul`).innerHTML =
        availableTimes;
      }, (err) => {
        // FIXME(Emily)
      });
    });
  }

  highlightDate(day) {
    $('.BookingCalendar-date--bookable.is-active').removeClass('is-active');
    day.closest('td').addClass('is-active');
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

      let className = this.dateBookable(this.formatIso(curDate), this.settings.bookableDates) ? 'BookingCalendar-date--bookable' : 'BookingCalendar-date--unavailable';
      if (curDate < from || curDate > to) {
        className += ' BookingCalendar-date--hide';
      }

      let bookable = this.settings.bookingData[this.formatIso(curDate)];
      if(bookable) {
        displayAvailable = `${bookable.available_slots_count} available`;
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
          week: curDate.week(),
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

  dateBookable(date, dates) {
    return dates.indexOf(date) >= 0;
  }
};

module.exports = (bookingData) => {
  return new SlotPicker(bookingData);
};
