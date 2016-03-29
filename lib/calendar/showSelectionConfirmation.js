'use strict';

const dom = require('../helpers/domHelpers');
const datetime = require('../datetime/datetime');

const selection_confirmation_template = require('../../views/client/selection_confirmation.mustache');

module.exports = (datetimeString) => {
  let appointment = datetime(datetimeString);
  let appointmentCellElement = document.querySelector(`.AppointmentTimes-list--item.datetime-${appointment.toDateTimeClassString()}`);
  if (!appointmentCellElement) { return; }

  dom.hideElementsBySelectors('.SelectionConfirmation');
  let selectedCell = document.querySelector(`.AppointmentTimes-list--item.datetime-${appointment.toDateTimeClassString()} a`);

  let tabIndex = ((typeof selectedCell !== "undefined") && selectedCell !== null) ? selectedCell.tabIndex : "";

  let selectionData = {
    selected_appointment: appointment.toDateTimeString(),
    display_date: appointment.displayDate(),
    display_time: appointment.displayTime(),
    ampm: appointment.amPm(),
    tabindex: tabIndex,
    year: appointment.year()
  };

  let renderedSelectionConfirmationHtml = selection_confirmation_template.render(selectionData);
  document.querySelector(`.SelectionConfirmationCell.date-${appointment.toDateString()}`).innerHTML = renderedSelectionConfirmationHtml;

  document.querySelector(`.SelectionConfirmation.date-${appointment.toDateString()}`).style.display = '';
  selectedCell.focus();
}
