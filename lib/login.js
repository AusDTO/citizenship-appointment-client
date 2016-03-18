'use strict';

require("babel-polyfill");

const form_validator = require('./login_form/validation');
const form_validation_marking = require('./login_form/validation_marking');
const ga = require('ga');

const toggleClientIdHelp = (hash) => {
  let helpDiv = document.querySelector('.ClientIdHelp');

  if(hash === '#help'){
    helpDiv.className = "ClientIdHelp expanded";
  } else {
    helpDiv.className = "ClientIdHelp collapsed";
  }
}

if(window.location.hash) {
  handleHashChange();
}

window.addEventListener("hashchange", handleHashChange, null);

function handleHashChange(){
  let hash = location.hash;
  if (hash === '#help' || hash === '#nohelp') {
    ga('send', 'event', 'Login', hash);
    toggleClientIdHelp(hash);
  } else if (hash.startsWith('#validation')) {
    form_validation_marking();
  }
}

form_validator();
