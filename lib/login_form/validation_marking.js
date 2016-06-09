'use strict';

function markFieldInvalidAndShowMessage (fieldId, messageId){
  var field = document.getElementById(fieldId),
    errorMessage = document.getElementById(messageId);

  errorMessage.className ="validation-error";
  field.setAttribute('aria-describedby', messageId);
  field.focus();
  field.className="invalid";
};

function markFieldValidAndHideMessage(fieldId, messageId){
  var field = document.getElementById(fieldId),
      errorMessage = document.getElementById(messageId);

  errorMessage.className = "validation-error inactive";
  field.setAttribute('aria-describedby', "");
  field.className="";
};

module.exports = () => {
  markFieldValidAndHideMessage("clientId", "clientId-required");
  markFieldValidAndHideMessage("clientId", "clientId-pattern");
  markFieldValidAndHideMessage("familyName", "familyName-required");

  var errors = window.location.hash;
  errors.split('/').slice(1).forEach((error) => {
    ga('send', 'event', 'Login', '#validation', error);
  });
  if (errors.indexOf("familyNameReq") >=0) {
    markFieldInvalidAndShowMessage("familyName", "familyName-required");
  }
  if (errors.indexOf("clientIdReq") >=0) {
    markFieldInvalidAndShowMessage("clientId", "clientId-required");
  }
  if (errors.indexOf("clientIdPattern") >=0) {
    markFieldInvalidAndShowMessage("clientId", "clientId-pattern");
  }
};
