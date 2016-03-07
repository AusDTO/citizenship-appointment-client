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

var targetDate = new Date();
targetDate.setMonth(targetDate.getMonth() + 1);
var year = targetDate.getYear() + 1900;
var month = targetDate.getMonth() + 1;
var targetYear = '' + year;
var targetMonth = month < 10 ? '0' + month : '' + month;
var day = '';
if (targetDate.getDay() % 6) {
  day = targetDate.getDate();
} else {
  day = targetDate.getDate() + 2;
}
var targetDay = day < 10 ? '0' + day : '' + day;

var hrefMonth = 'month/' + targetYear + '-' + targetMonth;
var hrefDate = 'date/' + targetYear + '-' + targetMonth + '-' + targetDay;

var captureDirectory = 'build/monitor/';
casper.options.waitTimeout = 10000;

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

casper.waitForUrl(baseUrl + '/calendar', function() {
  this.echo('Calendar');
  this.capture(captureDirectory + 'calendar-thismonth.png');
  this.echo('Calendar - selecting ' + hrefMonth);
});

casper.waitForSelector('a[href="#' + hrefMonth + '"]', function() {
  this.echo('Calendar - next month');
  this.click('a[href="#' + hrefMonth + '"]');
  this.echo('Calendar - selecting ' + hrefDate);
});

casper.waitForSelector('a[href="#' + hrefDate + '"]', function() {
  this.echo('Calendar - date');
  this.capture(captureDirectory + 'calendar-nextmonth.png');
  this.click('a[href="#' + hrefDate + '"]');
});

var timeSelector = '.AppointmentLink';
casper.waitForSelector(timeSelector, function() {
  this.echo('Calendar - time');
  this.capture(captureDirectory + 'calendar-date.png');
  this.click(timeSelector);
});

casper.waitForSelector('#submitLogin', function() {
  this.echo('Calendar - submit');
  this.capture(captureDirectory + 'calendar-time.png');
  this.click('#submitLogin');
});

casper.waitForUrl(baseUrl + '/confirmation', function() {
  this.echo('Confirmation');
  this.capture(captureDirectory + 'confirmation.png');
  this.click('.logout-link');
});

casper.waitForUrl(baseUrl + '/login', function() {
  this.echo('Logout');
  this.capture(captureDirectory + 'logout.png');
});

casper.run(function() {
  this.echo('Done').exit();
});
