'use strict';

const express = require('express'),
    consolidate = require('consolidate'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false}),
    uaParser = require('ua-parser-js'),
    uuid = require('node-uuid'),
    moment = require('moment'),
    bwipjs = require('bwip-js'),
    querystring = require('querystring'),
    path = require('path'),
    fs = require('fs'),
    app = express(),
    publicPath = '/static';

app.set('view engine', 'mustache');
app.engine('mustache', consolidate.hogan);
app.set('views', path.join(__dirname, 'views', 'server'));

app.set('trust proxy', true);
app.set('x-powered-by', false);

if (process.env.FORCE_SSL) {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(['https://', req.hostname, req.url].join(''));
    }
    return next();
  });
}

if (process.env.NODE_ENV !== 'production') {
  const sassMiddleware = require('node-sass-middleware'),
    webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware');

  app.use(webpackMiddleware(webpack(require('./webpack.config')), {
    noInfo: false,
    quiet: false,
    lazy: false,
    publicPath: publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'dist'),
    debug: true,
    outputStyle: 'compressed',
    sourceMap: path.join(__dirname, 'dist', 'bundle.css.map'),
    prefix: publicPath
  }));

  app.use(require('connect-livereload')({ignore: ['.pdf', '/wallet/pass']}));  // runs livereload server and serves livereload.js. It interferes with binary file downloads
  require('express-livereload')(app, {watchDir: path.join(__dirname), exts: ['mustache']});  // inserts <script> reference to livereload.js
}

app.use(publicPath, express.static(path.join(__dirname, 'dist')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'images', 'favicon.ico')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy",
      "default-src 'self'; "+
      "script-src 'self' http://localhost:35729/livereload.js www.google-analytics.com https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval';"+
      "img-src 'self' www.google-analytics.com; "+
      "connect-src 'self' ws://localhost:35729/livereload; ");
    return next();
});

const trackingId = process.env.ANALYTICS_TRACKING_ID || 'UA-XXXXX-Y';

const location = 'Level 2, Casselden Place, 2 Lonsdale Street, Melbourne VIC 3000';
const locationURL = 'Visa+and+Citizenship+Office%2C+Level+2%2C+Casselden+Place%2C+2+Lonsdale+Street%2C+Melbourne+VIC+3000';

// BEGIN - Pages --------

app.get('/login', (req, res) => {
  res.render('login_page', {
    partials: getBaseHtmlPartials(),
    error: req.query.error,
    expired: req.query.expired,
    system_error: req.query.system_error,
    clientId: req.query.id,
    page_name: 'Login',
    is_login_page: true
  });
});

app.get('/calendar', (req, res) => {

  const time = moment().add(1, 'days');
  const appointment_date = time.format('dddd D MMMM YYYY');
  const appointment_time = time.format('h:mm A');

  res.render('calendar_page', {
    partials: extendObject(
      {
        extend_session_modal: 'partials/extend_session_modal',
        no_available_appointments_modal: 'partials/no_available_appointments_modal'
      },
      getBaseHtmlPartials()),
    unitId: "1212",
    error: req.query.error,
    unavailable: req.query.unavailable,
    not_eligible: req.query.not_eligible,
    appointment_date,
    appointment_time,
    location,
    locationURL,
    today_date: moment().format('YYYY-MM-DDTHH:mm:ss'),
    _csrf: {
      token: "csrf-token",
      parameterName: "_csrf"
    },
    page_title: 'Citizenship Appointment Booking Calendar',
    page_name: 'Calendar',
    is_logged_in: true
  });
});

// simplified logic, doesn't handle versions (iOS >= 6, Mac OS X >= 10.8.2)
let supportsWallet = function(userAgentHeader) {
  const ua = uaParser(userAgentHeader);
  if (ua && ua.device && ua.device.model === 'iPhone') {
    return true;
  }
  if (ua && ua.browser && ua.browser.name === 'Safari') {
    return true;
  }
  return false;
}

let isMobile = function(userAgentHeader) {
  const ua = uaParser(userAgentHeader);
  return (ua && ua.device && ua.device.type === 'mobile');
}

app.get('/confirmation', (req, res) => {
  const time = req.query.time ? moment(req.query.time, moment.ISO_8601) : moment().add(1, 'days');
  const appointment_date = time.format('dddd D MMMM YYYY');
  const appointment_time = time.format('h:mm A');

  res.render('confirmation_page', {
    partials: extendObject({
      apple_wallet_modal: 'partials/apple_wallet_modal',
      add_to_wallet_instructions: 'partials/add_to_wallet_instructions'
    }, getBaseHtmlPartials()),
    appointment_date,
    appointment_time,
    location,
    locationURL,
    clientId: "01234567890",
    customerId: "01234567890",
    unitId: "1212",
    hasEmail: true,
    hasMobile: true,
    supportsWallet: supportsWallet(req.headers['user-agent']),
    useWalletModal: !supportsWallet(req.headers['user-agent']) && !isMobile(req.headers['user-agent']),
    page_title: 'Citizenship Appointment Booking Confirmation',
    page_name: 'Appointment Confirmation',
    is_logged_in: true
  });
});

app.get('/wallet/pass', (req, res) => {
  if (supportsWallet(req.headers['user-agent'])) {
    res.type('application/vnd.apple.pkpass');
    res.sendFile(path.join(__dirname, 'appointment.pkpass'));
  } else {
    res.redirect(`/wallet/pass/barcode?id=${req.query.id}&otherid=${req.query.otherid}`);
  }
});

app.get('/wallet/pass/barcode', (req, res) => {
  res.render('wallet_barcode_page', {
    partials: extendObject({
      add_to_wallet_instructions: 'partials/add_to_wallet_instructions'
    }, getBaseHtmlPartials()),
    'clientId': '01234567890',
    'customerId': '01234567890',
    page_name: 'Add to Apple Wallet'
  });
});

app.get('/error', (req, res) => {
  res.render('error_page', {
    partials: getBaseHtmlPartials(),
    expired: req.query.expired,
    page_name: 'Error',
    is_logged_in: false
  });
});

app.get('/session_timeout', (req, res) => {
  res.render('session_timeout', {
    partials: getBaseHtmlPartials(),
    page_name: 'Session Timeout',
    is_logged_in: false
  });
});

app.get('/cookies', (req, res) => {
  res.render('cookies', {
    partials: getBaseHtmlPartials(),
    page_name: 'About Cookies'
  });
});

let getBaseHtmlPartials = function(){
  return {
    premain: 'partials/header/premain',
    postmain: 'partials/footer/postmain',
    postmain: 'partials/footer/postmain',
    header: 'partials/header/header',
    beta: 'partials/header/beta',
    feedback: 'partials/footer/feedback',
    footer: 'partials/footer/footer',
    oldbrowser_warning: 'partials/header/oldbrowser_warning',
    cookies_warning: 'partials/footer/cookies_warning'
  }
};

let extendObject = function(base, extra){
  for (var i in extra) {
        if (extra.hasOwnProperty(i)) {
         base[i] = extra[i];
      }
   }
   return base;
};

// END   - Pages --------

// BEGIN - Calendar text only  --------
app.get('/calendar/text', (req, res) => {
  const dates = [];
  for (let i = 0; i < 80; i++) {
    let dateToAdd = moment().add(i, 'days');
    if (dateToAdd.day() % 6) {
      dates.push({
        id: 1268 + i,
        availableTimesCount: 4,
        displayDate: dateToAdd.format('dddd Do MMMM YYYY')
      });
    }
  };

  res.render('no_js_calendar/calendar_nojs', {
    partials: getNoJSHtmlPartials(),
    unitId: "1212",
    error: req.query.error,
    unavailable: req.query.unavailable,
    location,
    locationURL,
    available_dates: dates,
    page_name: 'Select Date',
    is_logged_in: true
  });
});

app.get('/calendar/text/:calendarId', (req, res) => {
  res.render('no_js_calendar/daytimes_nojs', {
   partials: getNoJSHtmlPartials(),
    unitId: "1212",
    error: req.query.error,
    unavailable: req.query.unavailable,
    location,
    locationURL,
    display_date: "Wednesday, 12th January 2016",
    date: '2016-01-12',
    page_name: 'Select Time',
    is_logged_in: true,
    available_times: [ {
      time: "09:00",
      displayTime: "9:00 AM"
    },
    {
      time: "09:40",
      displayTime: "9:40 AM"
    },
    {
      time: "12:00",
      displayTime: "1:00 PM"
    },
    {
      time: "15:00",
      displayTime: "3:00 PM"
    }
    ]
  });
});

app.get('/calendar/text/:date/:time', (req, res) => {
  res.render('no_js_calendar/selection_nojs', {
   partials: getNoJSHtmlPartials(),
    unitId: "1212",
    error: req.query.error,
    unavailable: req.query.unavailable,
    location,
    locationURL,
    display_appointment_datetime: "1:20 PM Wednesday, 12th January 2016",
    selected_appointment: "2016-01-12TT15:00:00",
    page_name: 'Confirm Selection',
    is_logged_in: true,
    _csrf: {
      token: "csrf-token",
      parameterName: "_csrf"
    }
  });
});

let getNoJSHtmlPartials = function(){
  return {
    premain: '../partials/header/premain',
    postmain: '../partials/footer/postmain',
    header: '../partials/header/header',
    beta: '../partials/header/beta',
    feedback: '../partials/footer/feedback',
    footer: '../partials/footer/footer',
    oldbrowser_warning: '../partials/header/oldbrowser_warning',
    cookies_warning: '../partials/footer/cookies_warning'
  }
};


// END   - Calendar text only  --------

// BEGIN - Pages backend calls --------

app.get('/get_available_dates.json', (req, res) => {
  const dates = {};
  for (let i = 0; i < 80; i++) {
    let dateToAdd = moment().add(i, 'days');
    if (dateToAdd.day() % 6) {
      dates[dateToAdd.format('YYYY-MM-DD')] = {
        calendar_id: 1268 + i,
        available_times_count: 21
      };
    }
  }
  res.json(dates);
});

app.get('/get_available_times', (req, res) => {
  res.json({
    "times": [
      "09:00",
      "09:20",
      "09:40",
      "10:00",
      "10:20",
      "10:40",
      "11:00",
      "11:20",
      "11:40",
      "12:00",
      "12:20",
      "12:40",
      "13:00",
      "13:20",
      "13:40",
      "14:00",
      "14:20",
      "14:40",
      "15:00",
      "15:20",
      "15:40"
    ]
  });
});

app.post('/login', urlencodedParser, (req, res) => {
    if(req.body.username === '00000000000'){
      res.redirect('/login?error=true');
    }else {
      res.redirect('/calendar');
    }
});

app.post('/book_appointment', urlencodedParser, (req, res) => {
  if (!req.body)
    return res.sendStatus(400);
  var date = req.body.selected_appointment;

  if(date.endsWith("10:20:00")){
    res.redirect('/calendar?error=true');
  } else if(date.endsWith("10:00:00")){
    res.redirect('/calendar?unavailable=true');
  } else if(date.endsWith("10:40:00")){
    res.redirect('/calendar?not_eligible=true');
  }
  else{
    res.redirect('/confirmation?time=' + date);
  }
});

// END   - Pages backend calls  --------

app.get('/extend_session', (req, res) => {
  let json = {};
  res.json(json);
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/logout', (req, res) => {
  res.redirect('/login');
});

app.get('/analytics_basic.js', function(req, res) {
  res.type('application/javascript');
  res.render('partials/analytics', {
    trackingId: trackingId
  })
});

app.get('/analytics_auth.js', function(req, res) {
  res.type('application/javascript');
  res.render('partials/analytics', {
    trackingId: trackingId,
    clientId: '00000000000'
  })
});

app.get('/barcode/pdf417/:id', (req, res) => {
  bwipjs.toBuffer({
    bcid: 'pdf417compact',
    text: req.params.id.substring(0, 11)
  }, function (err, pngBuffer) {
    if (err) {
      console.log(err);
      res.type('text/plain');
      res.status(500).send('Internal server error');
    } else {
      res.type('png');
      res.status(200).send(pngBuffer);
    }
  });
});

app.get('/wallet/pass/barcode.png', (req, res) => {
  bwipjs.toBuffer({
    bcid: 'qrcode',
    text: req.protocol + '://' + req.get('host') + req.originalUrl
  }, function (err, pngBuffer) {
    if (err) {
      console.log(err);
      res.type('text/plain');
      res.status(500).send('Internal server error');
    } else {
      res.type('png');
      res.status(200).send(pngBuffer);
    }
  });
});

// BEGIN - Calendars --------

app.get('/calendar.ics', function(req, res) {
  res.type('text/calendar');
  res.render('calendar_ics', {
    id: uuid.v4(),
    timeZone: 'Australia/Melbourne',
    startTime: '20160204T130000',
    endTime: '20160204T150000',
    location
  })
});

app.get('/googlecalendar', function(req, res) {
  var calendar_event = querystring.stringify({
    'action': 'TEMPLATE',
    'text': 'Citizenship appointment',
    'dates': '20160204T130000Z/20160204T150000Z',
    'location': location,
    'details': 'For details please refer to your citizenship appointment email/letter.',
    'trp': 'false'
  });
  res.redirect('https://www.google.com/calendar/event?' + calendar_event);
});

app.get('/yahoocalendar', function(req, res) {
  var calendar_event = querystring.stringify({
    'v':'60',
    'DUR': '0200',
    'TITLE': 'Citizenship appointment',
    'ST': '20160204T130000Z',
    'in_loc': location,
    'DESC': 'For details please refer to your citizenship appointment email/letter.'
  });
  res.redirect('https://calendar.yahoo.com/?' + calendar_event);
});

app.get('/outlookonline', function(req, res) {
  var calendar_event = querystring.stringify({
    'rru': 'addevent',
    'summary': 'Citizenship appointment',
    'dtstart': '20160204T130000Z',
    'dtend': '20160204T150000Z',
    'location': location,
    'description': 'For details please refer to your citizenship appointment email/letter.',
  });
  res.redirect('https://calendar.live.com/calendar/calendar.aspx?' + calendar_event);
});

// END    - Calendars --------

app.get('*', function(req, res){
  res.redirect('/error');
});

let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
