'use strict';

module.exports = (options) => {
  options = options || {};

  let remote_options = {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,

    desiredCapabilities: {
      browserName: options.browser || process.env.BROWSER || 'chrome', // android chrome firefox 'internet explorer' iPhone iPad safari
      version: options.browserVersion || process.env.BROWSER_VERSION || '',
      platform: options.platform || process.env.PLATFORM || 'ANY', // ANY WINDOWS XP VISTA MAC LINUX UNIX ANDROID
      build: process.env.TRAVIS_BUILD_NUMBER || new Date().toISOString(),
      name: options.testSuiteName || 'Default'
    }
  }

  if (process.env.SAUCE_ON_DEMAND !== 'true') {
    remote_options = Object.assign(remote_options, {
      host: options.host || 'localhost',
      port: options.port || process.env.USE_SAUCE === 'true' ? 4445 : 4444, // port 4445 is used with Sauce Connect
      desiredCapabilities: {
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER || process.env.SAUCE_USERNAME,
      }
    });
  }

  const client = require('webdriverio').remote(remote_options);

  client.baseUrl = options.baseUrl || process.env.BASE_URL || `http://localhost:${options.port || process.env.PORT || 3000}`;

  console.log(`Testing application on ${client.baseUrl}`);

  return client;
};
