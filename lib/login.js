'use strict';

if (!navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'block';
}

const toggleClientIdHelp = () => {
  let el = document.querySelector('.ClientId-hide');
  let el2 = document.querySelector('.ClientId-show');
  if (el.style.display === 'block') {
    el.style.display = 'none';
    el2.style.display = 'block';
  } else {
    el.style.display = 'block';
    el2.style.display = 'none';
  }
}

if(window.location.hash) {
  let hash = location.hash;
  console.log(hash);
  if (hash === '#help') {
    toggleClientIdHelp();
  }
}
window.addEventListener("hashchange", toggleClientIdHelp);
