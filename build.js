'use strict';

const sass = require('node-sass'),
      mkdirp = require('mkdirp'),
      path = require('path'),
      fs = require('fs');

mkdirp.sync(path.join(__dirname, 'dist'));

let result = sass.renderSync({
  file: path.join(__dirname, 'sass', 'main.scss'),
  includePaths: [path.join(__dirname, 'node_modules', 'skeleton-scss')]
});
fs.writeFileSync(path.join(__dirname, 'dist', 'bundle.css'), result.css);
