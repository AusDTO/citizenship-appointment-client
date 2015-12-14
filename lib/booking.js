'use strict';

let bookableDates = {
  "2015-12-04": {
		"calendar_id": 184,
		"vacant_slots": 3
	},
	"2015-12-15": {
		"calendar_id": 185,
		"vacant_slots": 7
	},
	"2015-12-18": {
		"calendar_id": 186,
		"vacant_slots": 1
	},
	"2016-01-26": {
		"calendar_id": 189,
		"vacant_slots": 4
	},
  "2016-02-17": {
    "calendar_id": 190,
    "vacant_slots": 12
  }
};

let slotpicker = require('./slotpicker')(bookableDates);