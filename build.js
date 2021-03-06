'use strict';

const sass = require('node-sass'),
      mkdirp = require('mkdirp'),
      path = require('path'),
      fs = require('fs');

mkdirp.sync(path.join(__dirname, 'dist'));

let result = sass.renderSync({
  file: path.join(__dirname, 'sass', 'bundle.scss'),
  outputStyle: 'compressed',
  outFile: 'bundle.css',
  sourceMap: true
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css'), result.css);
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css.map'), result.map);
