'use strict';

const express = require('express'),
      sassMiddleware = require('node-sass-middleware'),
      path = require('path'),
      app = express(),
      default_port = (process.env.PORT || 3000);

app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'dist'),
    debug: true,
    outputStyle: 'nested'
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'views')));

let server = app.listen(default_port, function () {
  let port = server.address().port;
  console.log('Listening on port ' + port);
});
