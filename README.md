# citizenship-appointment-client [![Travis CI Build Status](https://travis-ci.org/AusDTO/citizenship-appointment-client.svg?branch=master)](https://travis-ci.org/AusDTO/citizenship-appointment-client)

This is the client code (JavaScript, CSS, client and server-side templates) for the citizenship appointment service.

The server code can be found in this repository: [AusDTO/citizenship-appointment-server](https://github.com/AusDTO/citizenship-appointment-server)

## Instructions

### Prerequisites

NodeJS version 5+ with npm

### Dependencies

To install dependencies:

    npm install

### Running the application

To simply run the application:

    npm start

You can optionally supply the port number to use as an environment variable:

    PORT=8080 npm start

The port defaults to 3000. Use `PORT=0` to select a random port.

### Development

To run the application with file watching and automatic restarts enabled:

    npm run dev

### Testing

#### Unit tests

To run unit tests:

    npm test

#### Selenium tests locally

To run Selenium tests locally, first ensure that the Selenium standalone server has been installed (this only needs to be done once):

    npm run selenium-install

Next, you need to start the Selenium standalone server (in another terminal tab/window):

    npm run selenium-start

Then, to run the Selenium tests locally using Google Chrome:

    npm run uitest

This will start the application automatically on localhost port 3001 and then run the tests.

Use another web browser for testing by supplying an environment variable:

    BROWSER=firefox npm run uitest

See [the Selenium wiki on DesiredCapabilities](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities) for other browser options.

#### Selenium tests on Sauce Labs

To run Selenium tests on Sauce Labs, first ensure that the Selenium standalone server has been installed (this only needs to be done once):

    npm run sauce-connect-install

You also need to set up your Sauce Labs credentials as environment variables (say, in your `~/.profile`):

    export SAUCE_USERNAME=Your Sauce Labs username
    export SAUCE_ACCESS_KEY=Your Sauce Labs API key

Next, you need to start Sauce Connect (in another terminal tab/window):

    npm run sauce-connect-start

Then, to run the Selenium tests on Sauce Labs using Google Chrome:

    USE_SAUCE=true npm run uitest

This will start the application automatically on localhost port 3001 and then run the tests from Sauce Labs.

Use another web browser for testing by supplying an environment variable:

    USE_SAUCE=true BROWSER=firefox npm run uitest

#### Running tests using ./go and Docker

First you'll need to [install the Docker Engine](https://docs.docker.com/engine/installation/).

To run the unit test suite:

    ./go test

To run Selenium tests:

    ./go uitest

To run cross-browser tests via Sauce Connect:

    ./go cross_browser_test
