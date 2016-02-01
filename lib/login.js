'use strict';

require("babel-polyfill");

const form_validator = require('./login_form/validation');
const form_validation_marking = require('./login_form/validation_marking');

if (!navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'block';
}

const toggleClientIdHelp = () => {
  let el = document.querySelectorAll('.ClientIdHelp-hide');
  let el2 = document.querySelectorAll('.ClientIdHelp-show');
  for(var i = 0; i < el.length; ++i) {
    if (el[i].style.display === 'block') {
      el[i].style.display = 'none';
      el2[i].style.display = 'block';
    } else {
      el[i].style.display = 'block';
      document.getElementById("clientId-image").focus();
      el2[i].style.display = 'none';
    }
  }
}

if(window.location.hash) {
  handleHashChange(); 
}

window.addEventListener("hashchange", handleHashChange);

function handleHashChange(){
  let hash = location.hash;
  if (hash === '#help' || hash === '#nohelp') {
    toggleClientIdHelp();
  } else if (hash.startsWith('#validation')) {
    form_validation_marking();
  } 
}

form_validator();
