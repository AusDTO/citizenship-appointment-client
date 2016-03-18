document.querySelector('.warning-oldbrowsers').style.display='block';

function toggleClientIdHelp(hash) {
  var helpDiv = document.querySelector('.ClientIdHelp');

  if(hash === '#help'){
    helpDiv.className = "ClientIdHelp expanded";
  } else {
    helpDiv.className = "ClientIdHelp collapsed";
  }
}

if(window.location.hash) {
  handleHashChange();
}

window.onhashchange = handleHashChange;

function handleHashChange(){
  var hash = location.hash;
  if (hash === '#help' || hash === '#nohelp') {
    ga('send', 'event', 'Login', hash);
    toggleClientIdHelp(hash);
  } else if (hash.lastIndexOf('#validation') > -1) {
    form_validation_marking();
  }
}

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
    window.location.hash = "validation/"+errors.join('/')
  }
  return formvalid;
};


var form = document.getElementById("loginForm");
form.noValidate = true;
form.onsubmit = validateForm;

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

  errorMessage.className ="validation-error inactive";
  field.setAttribute('aria-describedby', "");
  field.className="";
};

function form_validation_marking(){
  markFieldValidAndHideMessage("clientId", "clientId-required");
  markFieldValidAndHideMessage("clientId", "clientId-pattern");
  markFieldValidAndHideMessage("familyName", "familyName-required");

  var errors = window.location.hash;
  if (errors.indexOf("familyNameReq") >=0) {
    markFieldInvalidAndShowMessage("familyName", "familyName-required");
  }
  if (errors.indexOf("clientIdReq") >=0) {
    markFieldInvalidAndShowMessage("clientId", "clientId-required");
  }
  if (errors.indexOf("clientIdPattern") >=0) {
    markFieldInvalidAndShowMessage("clientId", "clientId-pattern");
  }
}
