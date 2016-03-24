#!/usr/bin/env bash

set -ef -o pipefail

BROWSER=chrome USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER=firefox USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER='internet explorer' BROWSER_VERSION=11 USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER='internet explorer' BROWSER_VERSION=9 USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER=safari PLATFORM=MAC BROWSER_VERSION=8 USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER='iphone' PLATFORM='OS X 10.10' BROWSER_VERSION='9.2' DEVICE_NAME='iPhone 6' DEVICE_ORIENTATION='portrait' USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment.js
BROWSER='internet explorer' BROWSER_VERSION=8 USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment_oldBrowsers.js
BROWSER='firefox' BROWSER_VERSION=44 USE_SAUCE=true ./node_modules/.bin/tape test/ui/loginAndBookAppointment_noJSFirefox.js
