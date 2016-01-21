'use strict';

if (!navigator.cookieEnabled) {
  document.querySelector('.warning-cookies').style.display = 'block';
}

const toggleClientIdHelp = () => {
  let el = document.querySelector('.ClientIdHelp-image');
  if (el.style.display === 'block') {
    el.style.display = 'none';
    document.querySelector('.ClientIdHelp-link').textContent = 'How to find your Client ID';
  } else {
    el.style.display = 'block';
    document.querySelector('.ClientIdHelp-link').textContent = 'Hide how to find your Client ID';
  }
}

document.querySelector('.ClientIdHelp-link').addEventListener("click", () => {
  toggleClientIdHelp();
});

// If a user stays too long on the login page without logging in, reload the page to get a fresh CSRF token
setTimeout(() => {
  window.location.reload()
}, 1000 * 60 * 28); // 28 minutes
