'use strict';

const express = require('express'),
      consolidate = require('consolidate'),
      sassMiddleware = require('node-sass-middleware'),
      webpack = require('webpack'),
      webpackMiddleware = require('webpack-dev-middleware'),
      path = require('path'),
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
    lazy: true,
    publicPath: "/",
    stats: {
        colors: true
    }
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(require('connect-livereload')());  // runs livereload server and serves livereload.js
require('express-livereload')(app, { watchDir: path.join(__dirname) });  // inserts <script> reference to livereload.js

app.get('/', (req, res) => {
  res.render('index');
});

let server = app.listen(default_port, function () {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
