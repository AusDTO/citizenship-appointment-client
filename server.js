'use strict';

const express = require('express'),
    consolidate = require('consolidate'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false}),
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
    outputStyle: 'nested',
    sourceMap: path.join(__dirname, 'dist', 'bundle.css.map'),
    prefix: publicPath
  }));

  app.use(require('connect-livereload')());  // runs livereload server and serves livereload.js
  require('express-livereload')(app, {watchDir: path.join(__dirname), exts: ['mustache']});  // inserts <script> reference to livereload.js
}

app.use(publicPath, express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'test_data')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy",
      "default-src 'self'; "+
      "script-src 'self' http://localhost:35729/livereload.js www.google-analytics.com 'unsafe-inline' 'unsafe-eval';"+
      "img-src 'self' www.google-analytics.com; "+
      "connect-src 'self' ws://localhost:35729/livereload; ");
    return next();
});

const trackingId = process.env.ANALYTICS_TRACKING_ID || 'UA-XXXXX-Y';

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

app.get('/login', (req, res) => {
  const clientId = req.query.id;
  res.render('login_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback'
    },
    error: req.query.error,
    expired: req.query.expired
  });
});

app.post('/login', urlencodedParser, (req, res) => {
    if(req.body.username === '00000000000'){
      res.redirect('/login?error=true');
    }else {
      res.redirect('/calendar');
    }
});

app.get('/calendar', (req, res) => {
  const clientId = req.query.id;
  res.render('calendar_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      extend_session_modal: 'partials/extend_session_modal',
      feedback: 'partials/feedback'
    },
    unitId: "1212",
    error: req.query.error,
    unavailable: req.query.unavailable,
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    locationURL: "2+Lonsdale+Street,+Melbourne+VIC+3000",
    current_appointment: "Thursday, 12 December, 1:30PM",
    today_date: "2016-01-05T11:20:00",
    _csrf: {
      token: "csrf-token",
      parameterName: "_csrf"
    }
  });
});

app.get('/error', (req, res) => {
  res.render('error_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback'
    },
    expired: req.query.expired
  });
});

app.post('/book_appointment', urlencodedParser, (req, res) => {
  if (!req.body)
    return res.sendStatus(400);
  var date = req.body.selected_appointment;

  if(date.endsWith("10:20:00")){
    res.redirect('/calendar?error=true');
  }
  if(date.endsWith("10:00:00")){
    res.redirect('/calendar?unavailable=true');
  }
  else{
    res.redirect('/confirmation?time=' + req.body.selected_appointment);
  }
});

app.get('/confirmation', (req, res) => {
  const time = moment(req.query.time || '2016-03-28T15:40:40', moment.ISO_8601);
  const appointment_date = time.format('dddd D MMMM YYYY');
  const appointment_time = time.format('h:mm A');
  res.render('confirmation_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback'
    },
    appointment_date,
    appointment_time,
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    locationURL: "2+Lonsdale+Street,+Melbourne+VIC+3000",
    clientId: "12345678901",
    unitId: "1212",
    hasEmail: true,
    hasMobile: true
  });
});

app.get('/session_timeout', (req, res) => {
  res.render('session_timeout', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback'
    }
  });
});

app.get('/analytics.js', function(req, res) {
  res.type('text/plain');
  res.render('partials/analytics', {
    trackingId: trackingId
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

app.get('/calendar.ics', function(req, res) {
  res.type('text/calendar');
  res.render('calendar_ics', {
    id: uuid.v4(),
    timeZone: 'Australia/Melbourne',
    startTime: '20160204T130000',
    endTime: '20160204T150000',
    location:'2 Lonsdale Street, Melbourne VIC 3000, Australia'
  })
});

app.get('/googlecalendar', function(req, res) {
  var calendar_event = querystring.stringify({
    'action': 'TEMPLATE',
    'text': 'Citizenship appointment',
    'dates': '20160204T130000Z/20160204T150000Z',
    'location': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
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
    'in_loc': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
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
    'location': '2 Lonsdale Street, Melbourne VIC 3000, Australia',
    'description': 'For details please refer to your citizenship appointment email/letter.',
  });
  res.redirect('https://calendar.live.com/calendar/calendar.aspx?' + calendar_event);
});

app.get('*', function(req, res){
  res.redirect('/error');
});

let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
