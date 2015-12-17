'use strict';

const express = require('express'),
      consolidate = require('consolidate'),
      sassMiddleware = require('node-sass-middleware'),
      webpack = require('webpack'),
      webpackMiddleware = require('webpack-dev-middleware'),
      path = require('path'),
      fs = require('fs'),
      app = express(),
      default_port = (process.env.PORT || 3000);

app.set('view engine', 'mustache');
app.engine('mustache', consolidate.hogan);
app.set('views', path.join(__dirname, 'views', 'server'));

app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'dist'),
    debug: true,
    outputStyle: 'nested',
    sourceMap: path.join(__dirname, 'dist', 'bundle.css.map')
}));

app.use(webpackMiddleware(webpack(require('./webpack.config')), {
    noInfo: false,
    quiet: false,
    lazy: false,
    publicPath: "/",
    stats: {
        colors: true
    }
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(require('connect-livereload')());  // runs livereload server and serves livereload.js
require('express-livereload')(app, { watchDir: path.join(__dirname), exts: ['mustache'] });  // inserts <script> reference to livereload.js

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {
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
  res.render('booking', {
    partials: {
      header: 'partials/header',
      footer: 'partials/footer',
      slotpicker: 'partials/slotpicker'
    },
    location: "2 Lonsdale Street, Melbourne VIC 3000",
    todayDate: "2015-12-09"
  });
});

let server = app.listen(default_port, () => {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
