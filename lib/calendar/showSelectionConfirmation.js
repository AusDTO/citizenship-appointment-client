'use strict';

const dom = require('../helpers/domHelpers');
const datetime = require('../datetime/datetime');

const selection_confirmation_template = require('../../views/client/selection_confirmation.mustache');

module.exports = (datetimeString) => {
  let appointment = datetime(datetimeString);
  let appointmentCellElement = document.querySelector(`.appointment-list-item.datetime-${appointment.toDateTimeClassString()}`);
  if (!appointmentCellElement) { return; }

  dom.toggleHideOn('.selected-appointment-section');
  let selectedCell = document.querySelector(`.appointment-list-item.datetime-${appointment.toDateTimeClassString()} a`);

  let tabIndex = ((typeof selectedCell !== "undefined") && selectedCell !== null) ? selectedCell.tabIndex : "";

  let selectionData = {
    selected_appointment: appointment.toDateTimeString(),
    display_date: appointment.displayDate(),
    display_time: appointment.displayTime(),
    ampm: appointment.amPm(),
    tabindex: tabIndex,
    year: appointment.year(),
    date: appointment.toDateString()
  };

  let renderedSelectionConfirmationHtml = selection_confirmation_template.render(selectionData);
  document.querySelector(`.selected-appointment-content.date-${appointment.toDateString()}`).innerHTML = renderedSelectionConfirmationHtml;

  dom.toggleShowOn(`.selected-appointment-section.date-${appointment.toDateString()}`);

  selectedCell.focus();
}
