'use strict';

const toggleClientIdHelp = () => {
  let el = document.querySelector('.ClientIdHelp-image');
  console.log(el.style.display);
  if (el.style.display === 'block') {
    el.style.display = 'none';
    document.querySelector('.ClientIdHelp-link').textContent = 'How to find Client ID';
  } else {
    el.style.display = 'block';
    document.querySelector('.ClientIdHelp-link').textContent = 'Hide how to find Client ID';
  }
}

document.querySelector('.ClientIdHelp-link').addEventListener("click", () => {
  toggleClientIdHelp();
});


