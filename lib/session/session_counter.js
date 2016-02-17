'use strict';

// const sessionTime = 30*60*1000-1000;
// const sessionEndingNotificationTime = 28*60*1000-1000;

const sessionTime = 10*1000-1000;
const sessionEndingNotificationTime = 5*1000-1000;


module.exports = () => {
	return {
		setTimeoutEvent: function (SessionExpiredEvent) {
			return setTimeout(SessionExpiredEvent, sessionTime);
		},

		setNotificationBeforeExpiry: function(SessionEndingEvent) {
			setTimeout(SessionEndingEvent, sessionEndingNotificationTime);
		}
	};
};
