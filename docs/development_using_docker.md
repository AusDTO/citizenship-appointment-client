#Development Setup

 How to start as a developer. Brief description of what you would need to have installed and what dependencies you should have configured to successfully run and contribute to the project.

##Prerequisites

You will need to:

* have git to checkout this repo ([how to install Git?](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
* have Docker installed ([how to install Docker?](https://docs.docker.com/engine/installation/))
* have Docker Compose installed ([how to install Docker Compose?](https://docs.docker.com/compose/install/))

##Starting the application

Start the docker container. In another tab execute:

  eval $(docker-machine env default)
  docker-machine ip default

This will provide you with the IP the app will be available under after you start it. In the root folder of the project run

  ./go dev

This will spin up the docker container, pull all the dependencies and start the application in the development mode (with live-reload of the application if the sources change). The applications will be available under:

  http://*DOCKER_CONTAINER_IP*:3000/ (eg. http://192.168.99.100:3000/)

##Environment variables

The environment variables that are used in this project are utilized for the testing purposes. As a part of our testing pipeline we execute UI tests using [Saucelabs](https://saucelabs.com/) to verify our app works across a set of browsers and operating systems. We use the following values:

  SAUCE_USERNAME - the saucelabs username we use to authenticate to the portal
  SAUCE_ACCESS_KEY - the saucelabs username we use to authenticate to the portal
  BROWSER - any specific browser we want to test the application with on saucelabs
  BROWSER_VERSION - any specific browser version we want to test the application with on saucelabs
  PLATFORM - any specific platform we want to test the application with on saucelabs

For more information visit the [Saucelabs Wiki](https://wiki.saucelabs.com/display/DOCS/)

##Next steps

All the commands you can run can be found in the go script located in the root folder of this project. Happy coding!

##Some useful info

###Codebase

The application uses VanillaJS and mustache templates. It is the frontend part of a bigger system, but we have created a simple NodeJS server to be able to run this application without pulling the backend. All the endpoints can be found in *server.js* file.

Views are split into server and client part - server views are used by the controllers of the backend to serve the main pages of the application, the client views are used by the frontend code only to allow JavaScript for simpler and clearer modifications of the displayed content.

###Development process

When you are done with implementing changes to the application and are happy with the level of the test coverage you added to make sure your changes work, before pushing the code, make sure you execute all the types of tests. There are three types of tests we are maintaining currently: unit tests, UI tests and cross-browser tests.

####Unit tests
To get a quick feedback on the unit tests, run

  ./go test

####UI tests

To test the current application quickly against Chrome, execute

  ./go uitest

This spins up the application and runs Selenium-based tests against it, giving a quick feedback on whether the main flow of the application has not been broken.

####Cross-browser tests

To run the cross browser tests, make sure you have SAUCE_USERNAME and SAUCE_ACCESS_KEY variables configured, and then run:

  ./go cross_browser_test

This will connect to your Saucelabs account and run the UI tests across a set of browsers and platforms. Those tests take time, as they are executed against different versions of Desktop and Mobile devices and browsers. Make sure those tests pass before you push your code.
