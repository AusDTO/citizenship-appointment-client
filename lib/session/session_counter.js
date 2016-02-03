'use strict';

var sessionTime = 30*60*1000-1000,
	sessionEndingNotificationTime = 28*60*1000-1000;

module.exports = () => {
	return {
		setTimeoutEvent: function (SessionExpiredEvent){
			setTimeout(SessionExpiredEvent, sessionTime);
		},

		setNotificationBeforeExpiry: function(SessionEndingEvent){
			setTimeout(SessionEndingEvent, sessionEndingNotificationTime);
		}
	}
};