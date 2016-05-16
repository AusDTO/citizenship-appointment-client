# Google Now integration

[Google Now](https://en.wikipedia.org/wiki/Google_Now) allows users of Android and iOS devices to easily view [cards](https://developers.google.com/schemas/now/cards) related to events, flights, hotel and restaurant reservations sent their Gmail accounts, based on date and time or a user's location.

[Gmail Actions](https://developers.google.com/gmail/markup/actions/actions-overview) is a related feature for users of Gmail via the web interface and the Inbox application on iOS and Android. It highlights key information for events, flights, hotel and restaurant reservations sent to their Gmail accounts, allowing for one-click actions such as modifying a reservation.

## Implementation

The email confirming a user's appointment contain a `<script>` element of type `application/ld+json` with the information required for Now cards and Gmail actions. The reservation is of type [EventReservation](https://developers.google.com/schemas/reference/event-reservation).

The appointment confirmation emails are authenticated using [Sender Policy Framework (SPF)](https://en.wikipedia.org/wiki/Sender_Policy_Framework) and [DomainKeys Identified Mail (DKIM)](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), and the `from` email address has been [whitelisted](https://developers.google.com/gmail/markup/registering-with-google) for Event Reservation Gmail actions by Google.

## References

[Use Now cards](https://support.google.com/websearch/answer/2819496?hl=en)

Google Developers: [Now cards](https://developers.google.com/schemas/now/cards)

Google Developers: [Gmail actions](https://developers.google.com/schemas/gmail/actions)

Google Developers: [Google Schemas: Event Reservation](https://developers.google.com/schemas/reference/event-reservation)

[Register with Google](https://developers.google.com/gmail/markup/registering-with-google) to whitelist an email address for Gmail actions
