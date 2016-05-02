/*
    This is a CasperJS script, not a NodeJS script.
    Stick to es5, and realise that the built-in APIs differ from NodeJS:

    CasperJS: http://docs.casperjs.org/en/latest/modules/index.html
    PhantomJS: http://phantomjs.org/api/
*/
'use strict';

var casper = require('casper').create();
var system = require('system');
var fs = require('fs');

var baseUrl = casper.cli.args[0] || system.env['MONITOR_BASE_URL'];
var clientId = casper.cli.args[1] || system.env['MONITOR_CLIENT_ID'];
var familyName = casper.cli.args[2] || system.env['MONITOR_FAMILY_NAME'];

if (!baseUrl || !clientId || !familyName) {
  console.log('Usage: casperjs bookAppointment.js <base URL> <client id> <family name>');
  console.log('       or use environment variables MONITOR_BASE_URL, MONITOR_CLIENT_ID, and MONITOR_FAMILY_NAME');
  casper.exit(1);
}
casper.echo("Executing tests on " + baseUrl);

var addMonthToDateString = function(dateString) {
    var appointmentDate = new Date(dateString);
    casper.echo('appointmentDate ' + appointmentDate);
    var year = appointmentDate.getYear() + 1900;
    casper.echo('year ' + year);
    var month = appointmentDate.getMonth() + 2;
    casper.echo('month ' + month);
    var targetYear = '' + year;
    var targetMonth = month < 10 ? '0' + month : '' + month;
    casper.echo('targetMonth ' + targetMonth);

    return targetYear + '-' + targetMonth;
};

var captureDirectory = 'build/monitor/';
casper.options.waitTimeout = 30000;

casper.start(baseUrl + '/login', function() {
  this.echo('Start');
  fs.makeTree(captureDirectory);
});

casper.waitForSelector('form#loginForm', function() {
  this.echo('Login');
  this.fill('form#loginForm', {
    'username': clientId,
    'familyName': familyName
  }, true);
  this.capture(captureDirectory + 'login.png');
});

casper.waitForSelector('.logout-link', function() {
  this.echo('Calendar');
  this.capture(captureDirectory + 'calendar.png');
});

casper.waitForSelector('p.DateCell-content--day', function() {
  this.echo('Calendar - loaded');
  this.capture(captureDirectory + 'calendar-thismonth-loaded.png');
});

casper.waitForSelector('[class*="DateCell Calendar-date--unavailable  date-20"]', function() {
  var cells = casper.getElementsAttribute('[class*="DateCell Calendar-date--unavailable  date-20"]', 'class');
  var currentDate = cells[0].match(/\d{4}-\d{2}-\d{2}/);
  this.echo('currentDate ' + currentDate);
  var monthLink = addMonthToDateString(currentDate);

  this.echo('Calendar - navigating to next month ' + monthLink);
  this.click('a[name="month/' + monthLink + '"]');
  var bookableDateSelector = '[class*="DateCell Calendar-date--bookable date-' + monthLink + '"]';

  this.waitForSelector(bookableDateSelector, function(){
    this.echo('Calendar - displaying next month');
    this.capture(captureDirectory + 'calendar-nextmonth.png');

    var nextMonthCells = casper.getElementsAttribute(bookableDateSelector, 'class');
    var dateLink = nextMonthCells[0].match(/\d{4}-\d{2}-\d{2}/);
    this.echo('Calendar - selecting ' + dateLink);

    var availableTimesSelector = '[class="AvailableTimes date-' + dateLink + '"] a.AppointmentLink';
    this.click('a[class="DateCell-content--datelink date-'+ dateLink + '"]');
    this.waitForSelector(availableTimesSelector, function(){
      this.echo('Calendar - available times opened ');
      this.capture(captureDirectory + 'calendar-times.png');

      var firstTimeLink = casper.getElementsAttribute(availableTimesSelector, 'name')[0];
      this.echo('Calendar - selecting ' + firstTimeLink);
      this.click('[name="' + firstTimeLink + '"]')
    });
  });
});

casper.waitForSelector('#submitLogin', function() {
  this.echo('Calendar - submit');
  this.capture(captureDirectory + 'calendar-time.png');
  this.click('#submitLogin');
});

casper.waitForSelectorTextChange('h1', function() {
  this.echo('Confirmation');
  this.capture(captureDirectory + 'confirmation.png');
  this.click('.logout-link');
});

casper.waitForSelector('form#loginForm', function() {
  this.echo('Logout');
  this.capture(captureDirectory + 'logout.png');
});

casper.run(function() {
  this.echo('Done').exit();
});
