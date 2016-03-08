'use strict';

require("babel-polyfill");

const form_validator = require('./login_form/validation');
const form_validation_marking = require('./login_form/validation_marking');
const ga = require('ga');

if (navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'none';
}

const toggleClientIdHelp = () => {
  let el = document.querySelector('.ClientIdHelp-hide');
  let el2 = document.querySelector('.ClientIdHelp-show');
    if (el.style.display === 'block') {
      el.style.display = 'none';
      el2.style.display = 'block';
    } else {
      el.style.display = 'block';
      el2.style.display = 'none';
    }
}

if(window.location.hash) {
  handleHashChange();
}

window.addEventListener("hashchange", handleHashChange);

function handleHashChange(){
  let hash = location.hash;
  if (hash === '#help' || hash === '#nohelp') {
    ga('send', 'event', 'Login', hash);
    toggleClientIdHelp();
  } else if (hash.startsWith('#validation')) {
    form_validation_marking();
  }
}

form_validator();
