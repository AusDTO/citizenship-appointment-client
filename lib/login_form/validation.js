'use strict';

function validateClientId (errors){
  var valid = true,
    clientIdField = document.getElementById("clientId");

  if(!isRequiredValid(clientIdField)){
    errors.push("clientIdReq");
    valid = false;
  } else if(!isRegExpValid(clientIdField)){
    errors.push("clientIdPattern");
    valid = false;
  }
  return valid;
};

function validateFamilyName (errors){
  var familyNameField = document.getElementById("familyName");

  if(!isRequiredValid(familyNameField)){
    errors.push("familyNameReq");
    return false;
  }
  return true;
};

function isRequiredValid (field) {
  var val = field.value
  return (val !== 'undefined' && val !== "");
};

function isRegExpValid (field) {
  var pattern = new RegExp(field.getAttribute("pattern"));
  return pattern.test(field.value);
};

function validateForm (event) {
  var errors = [],
    clientIdValid = validateClientId(errors),
    familyNameValid = validateFamilyName(errors),
    formvalid = clientIdValid && familyNameValid;

  if (!formvalid) {
    if (event.preventDefault) event.preventDefault();
    window.location.hash = "validation/"+errors.join('/')
  }
  return formvalid;
};

module.exports = () => {
	  var form = document.getElementById("loginForm");
	  form.noValidate = true;
	  form.onsubmit = validateForm;
	};
