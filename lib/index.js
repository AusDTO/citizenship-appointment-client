'use strict';

let $ = require('jquery');
let template = require('../views/client/message.mustache');
let html = template({message: 'Hello, World!'});
$('.index-heading').append(html);
