'use strict';

const $ = require('jquery');

let template = require('../views/client/message.mustache');
let html = template.render({message: 'Hello, World!'});
$('.index-heading').append(html);
