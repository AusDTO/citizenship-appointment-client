'use strict';

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
      el2[i].style.display = 'none';
    }
  }
}

if(window.location.hash) {
  let hash = location.hash;
  if (hash === '#help') {
    toggleClientIdHelp();
  }
}

window.addEventListener("hashchange", toggleClientIdHelp);
