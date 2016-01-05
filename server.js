'use strict';

const express = require('express'),
      consolidate = require('consolidate'),
      sassMiddleware = require('node-sass-middleware'),
      webpack = require('webpack'),
      webpackMiddleware = require('webpack-dev-middleware'),
      bodyParser = require('body-parser'),
      urlencodedParser = bodyParser.urlencoded({ extended: false }),
      path = require('path'),
      fs = require('fs'),
      app = express(),
      default_port = (process.env.PORT || 3000),
      publicPath = '/static';

app.set('view engine', 'mustache');
app.engine('mustache', consolidate.hogan);
app.set('views', path.join(__dirname, 'views', 'server'));

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

app.use(publicPath, express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'test_data')));
app.use(require('connect-livereload')());  // runs livereload server and serves livereload.js
require('express-livereload')(app, { watchDir: path.join(__dirname), exts: ['mustache'] });  // inserts <script> reference to livereload.js

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/get_available_times', (req, res) => {
  res.json({
  	"times": [
  		"13:00",
  		"13:20",
  		"13:40",
  		"14:00",
  		"14:20",
  		"14:40"
  	]
  });
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer'
    }
  });
});

app.post('/login', (req, res) => {
  res.redirect('/booking');
});

app.get('/booking', (req, res) => {
  res.render('booking_page', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      slotpicker: 'partials/slotpicker'
    },
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    todayDate: "2015-12-09"
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
      footer: 'partials/footer'
    },
    selected_appointment: "Thursday 21 January, 1:30 PM",
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    clientId: "919191",
    hasEmail: true,
    level: "Level 4" // TODO how to do it?
  });
});

let server = app.listen(default_port, () => {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
