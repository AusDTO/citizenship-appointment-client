'use strict';

const dom = require('../helpers/domHelpers');
const datetime = require('../datetime/datetime');

const selection_confirmation_template = require('../../views/client/selection_confirmation.mustache');

module.exports = (datetimeString) => {
  let appointment = datetime(datetimeString)
  dom.hideElementsBySelectors('.SelectionConfirmation');
  let selectionData = {
    selected_appointment: appointment.toDateTimeString(),
    display_date: appointment.displayDate(),
    display_time: appointment.displayTime(),
    ampm: appointment.amPm()
  };

  let renderedSelectionConfirmationHtml = selection_confirmation_template.render(selectionData);
  document.querySelector(`.SelectionConfirmationCell.date-${appointment.toDateString()}`).innerHTML = renderedSelectionConfirmationHtml;

  document.querySelector(`.SelectionConfirmation.date-${appointment.toDateString()}`).style.display = '';
}
