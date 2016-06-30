'use strict';

const mod = module.exports = {};

mod.addClass = (selectorString, className) => {
  Array.prototype.forEach.call(document.querySelectorAll(selectorString), (el) => {
    el.classList ? el.classList.add(className) : el.className += ' ' + className;
  });
};

mod.removeClass = (selectorString, className) => {
  Array.prototype.forEach.call(document.querySelectorAll(selectorString), (el) => {
    el.classList ?
        el.classList.remove(className) :
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  });
};

mod.toggleClass = (selectorString, className) => {
    let elements = document.querySelectorAll(selectorString);
    for (let el of elements) {
        if (el.classList) {
          el.classList.toggle(className);
        } else {
          var classes = el.className.split(' ');
          var existingIndex = classes.indexOf(className);

          if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
          else
            classes.push(className);

          el.className = classes.join(' ');
        }
    }
}

mod.toggleHideOn = (selectorString) => {
  mod.removeClass(selectorString, 'show');
  // mod.addClass(selectorString, 'hide');
  mod.addClass(selectorString, 'hidden');
}

mod.toggleShowOn = (selectorString) => {
  mod.removeClass(selectorString, 'hidden');
  // mod.removeClass(selectorString, 'hide');
  mod.addClass(selectorString, 'show');
}

mod.hideElementsBySelectors = (selectorString) => {
  Array.prototype.forEach.call(document.querySelectorAll(selectorString), (el) => {
    el.style.display = 'none';
  });
};

mod.clearHTML = (selectorString) => {
  Array.prototype.forEach.call(document.querySelectorAll(selectorString), (el) => {
    el.innerHTML = '';
  });
};

mod.highlightCalendarDate = (dateString) => {
  mod.removeClass('.date-bookable.is-active', 'is-active');
  mod.addClass(`.date-bookable.date-${dateString}`, 'is-active');
};

mod.unhighlightCalendarDates = () => {
  mod.removeClass('.date-bookable.is-active', 'is-active');
};

mod.highlightTimesCell = (datetimeClassString) => {
  mod.removeClass('.appointment-list-item.is-active', 'is-active');
  mod.addClass(`.appointment-list-item.datetime-${datetimeClassString}`, 'is-active');
};

mod.renderSystemError = (selectorString) => {
  let el = document.querySelector(selectorString);
  el.innerHTML = 'An error has occurred in the system. Please try again in a few minutes';
};

mod.focusMonthNav = (month) => {
  let el = document.querySelector(`.Calendar.month-${month} a.Calendar-nav--next`) ||
  document.querySelector(`.Calendar.month-${month} a.Calendar-nav--prev`);
  el ? el.focus() : mod.focusFirstActiveMonthDate(month);
};

mod.focusFirstActiveMonthDate = (month) => {
  let elems = document.querySelectorAll(`[class^='calendar-date date-bookable date-${month}'] a`);
  if (elems.length > 0) {
    elems[0].focus();
  }
};
