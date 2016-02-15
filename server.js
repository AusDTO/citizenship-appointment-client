'use strict';

const express = require('express'),
    consolidate = require('consolidate'),
    bodyParser = require('body-parser'),
    urlencodedParser = bodyParser.urlencoded({extended: false}),
    uuid = require('node-uuid'),
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

const trackingId = process.env.ANALYTICS_TRACKING_ID || 'UA-XXXXX-Y';

app.get('/get_available_times', (req, res) => {
  let json = {};
  if (req.query.calendar_id === '1247') {
    json = {
      "times": [
        "09:00",
        "09:20",
        "09:40",
        "10:00",
        "10:20",
        "10:40"
      ]
    };
  } else {
    json = {
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
    };
  }
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
      feedback: 'partials/feedback',
      analytics: 'partials/analytics'
    },
    trackingId,
    clientId,
    expired: req.query.expired
  });
});

app.post('/login', (req, res) => {
  res.redirect('/calendar');
});

app.get('/calendar', (req, res) => {
  const clientId = req.query.id;
  res.render('calendar_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback',
      analytics: 'partials/analytics'
    },
    trackingId,
    clientId,
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
      feedback: 'partials/feedback',
      analytics: 'partials/analytics'
    },
    trackingId,
    expired: req.query.expired
  });
});

app.post('/book_appointment', urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400)
  res.redirect('/confirmation');
});

app.get('/confirmation', (req, res) => {
  res.render('confirmation_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      beta: 'partials/beta',
      feedback: 'partials/feedback',
      analytics: 'partials/analytics'
    },
    trackingId,
    appointment_date: "Thursday 21 March 2015",
    appointment_time: "1:30 PM",
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    locationURL: "2+Lonsdale+Street,+Melbourne+VIC+3000",
    clientId: "12345678901",
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
      feedback: 'partials/feedback',
      analytics: 'partials/analytics'
    },
    trackingId
  });
});

app.get('/barcode/pdf417/:id', (req, res) => {
  bwipjs.toBuffer({
    bcid: 'pdf417compact',
    text: req.params.id
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

let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
