'use strict';

require("babel-polyfill");

const $ = require('jquery'),
      moment = require('moment'),
      week_template = require('../views/client/week.mustache'),
      day_template = require('../views/client/day.mustache'),
      month_template = require('../views/client/month.mustache'),
      times_template = require('../views/client/times.mustache'),
      selection_template = require('../views/client/selection.mustache');

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
    for(let date of Object.keys(bookingData)) {
        let calendar_id = bookingData[date].calendar_id;
        bookingData[date].availableTimes = new Promise( function (resolve, reject) {
          let request = new XMLHttpRequest();
          request.open('GET', `get_available_times?calendar_id=${calendar_id}`);
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
    this.settings.calendarData = this.buildCalendar();
    this.render(this.settings.navMonths[0].month());
    this.hideTimes();
    this.updateNav();
    this.bindNavEvents();
  }

  setupNavMonths() {
    let bookableMonths = [], prevMonth = '', curDate;
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
    this.selectedDateListener();
  }

  buildCalendar() {
    let from = '', to = '', calendar = {};
    for(let monthDate of this.settings.navMonths) {
      calendar[monthDate.month()] = this.buildMonth(monthDate);
    }
    return calendar;
  }

  buildMonth(monthDate) {
    let startDate = this.firstDayOfWeek(this.firstDayOfMonth(monthDate)),
        endDate = this.lastDayOfWeek(this.lastDayOfMonth(monthDate)),
        curDate = '', weeks = [], days = [], count = 1;

    for (curDate = startDate; curDate.isBefore(endDate); curDate.date(curDate.date() + 1)) {
      days.push(this.buildDay(curDate, startDate, endDate));
      if (count === 7) {
        weeks.push({
          week: curDate.week(),
          days: days
        });
        days = [];
        count = 0;
      }
      count++;
    }
    return weeks;
  }

  buildDay(curDate, from, to) {
    let dayStr = this.settings.days[curDate.day()],
        curIso = this.formatIso(curDate),
        todayIso = this.formatIso(this.settings.today);

    let className = this.settings.bookingData[this.formatIso(curDate)] ? 'BookingCalendar-date--bookable' : 'BookingCalendar-date--unavailable';
    if (curDate.isBefore(from) || curDate.isAfter(to)) {
      className += ' BookingCalendar-date--hide';
    }
    let bookable = this.settings.bookingData[this.formatIso(curDate)];
    let displayAvailable='';
    displayAvailable = bookable ? `${bookable.available_slots_count} available` : '';

    return {
      date: curIso,
      day: curDate.date(),
      available: displayAvailable,
      today: curIso === todayIso,
      klass: className
    };
  }

  render(month) {
    let output = month_template.render(
      {
        weeks: this.settings.calendarData[month]
      },
      {
        week: week_template,
        day: day_template
      }
    );
    document.querySelector('.BookingCalendar-datesBody').innerHTML = output;
    this.renderMonthLabel(month);
  }

  renderMonthLabel(month) {
    $('.BookingCalendar-currentMonth').text(this.settings.months[month]);
  }

  bindNavEvents() {
    var self = this;
    $('button.BookingCalendar-nav--next').click(() => {
      self.nudgeNav(1);
    });

    $('button.BookingCalendar-nav--prev').click(() => {
      self.nudgeNav(-1);
    });
  }

  selectedDateListener() {
    var self = this;
    $('.BookingCalendar-dateLink').click(function() {
      self.hideTimes();
      self.highlightDate($( this ));
      let week = $(this).closest('tr').attr('data-week');
      self.settings.selectedDate = $(this).attr('data-date');
      document.querySelector(`tr.CalRow-slots[data-week='${week}']`).style.display='table-row';
      self.settings.bookingData[self.settings.selectedDate].availableTimes.then((availableTimes) => {
        let output = times_template.render({
          times: availableTimes.map(self.displayTime)
        });
        document.querySelector(`tr.CalRow-slots[data-week='${week}'] ul`).innerHTML = output;
        self.selectedTimeListener();
      }, (err) => {
        // FIXME(Emily)
      });
    });
  }

  hideTimes() {
    this.clearSelection();
    $('tr.CalRow-slots').hide();
  }

  clearSelection() {
    $('td.CalRow-selection').empty();
    $('tr.CalRow-selection').hide();
  }

  selectedTimeListener() {
    var self = this;
    $('.BookingCalendar-timeLink').click(function() {
      self.clearSelection();
      let week = $(this).closest('tr').attr('data-week');
      document.querySelector(`tr.CalRow-selection[data-week='${week}']`).style.display='table-row';

      self.settings.selectedTime = $(this).attr('data-time');
      let data = self.displayTime(self.settings.selectedTime);
      data['selected_appointment'] = self.settings.selectedDate + "T" + self.settings.selectedTime + ":00";
      data['display_date'] = moment.utc(self.settings.selectedDate).format("dddd D MMMM");
      let output = selection_template.render(data);
      document.querySelector(`tr.CalRow-selection[data-week='${week}'] td`).innerHTML = output;
    });
  }

  highlightDate(day) {
    $('.BookingCalendar-date--bookable.is-active').removeClass('is-active');
    day.closest('td').addClass('is-active');
  }

  nudgeNav(i) {
    this.settings.navPointer = this.settings.navPointer + i;
    this.render(this.settings.navMonths[this.settings.navPointer].month());
    this.updateNav();
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

  displayTime(time) {
    let hours = parseInt(time.substr(0, 2)),
       mins = time.substr(2),
       ampm = hours >= 12 ? 'PM' : 'AM';
       hours = hours % 12;
       hours = hours ? hours : 12;
    return { time: time, display_time: hours + mins, ampm: ampm };
  }

};

module.exports = (bookingData) => {
  return new SlotPicker(bookingData);
};
