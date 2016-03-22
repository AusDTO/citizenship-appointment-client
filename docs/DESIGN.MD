#Design decisions and motivation

##Languages and Frameworks

###Presentation

When building the service, we wanted to keep in mind the [progressive enhancement approach](https://www.gov.uk/service-manual/making-software/progressive-enhancement.html). Therefore we made the system fully usable with only HTML. In order to achieve that we utilized server and client-side rendered templates. We chose Mustache as the templating language. One of the reasons was its wide implementation in multiple languages, which would allow us to quickly adapt it to different technologies. Even more importantly, we wanted the templates to contain almost no logic on their own and have it moved into the classes rendering the templates. This approach allowed us to write more testable code and not rely heavily on the DOM manipulation when displaying business-logic related elements.


###Behaviour / Functionality

As we added the JavaScript layer to our system, we have decided not to use any third-party frameworks and went with plain JS. We wanted to move as much of the business logic as possible into the server which meant that the JavaScript will not be overly complicated. Keeping in mind the progressive enhancement approach, we used JavaScript as a layer on top of the already working website. In this case the overhead of downloading, including and adjusting a framework to our needs seemed excessive. We chose plain JS instead.

We split our JavaScript code into modules and utilized Webpack to facilitate the dependency management. This allowed us to reuse common code more easily and split functionality into logical blocks. We also strived to keep our code layered, separating DOM manipulation from any business logic that was in JS or ajax calls. This helped us write more focused and simpler unit tests.

In order to take full advantage of the functionality introduced in ES6 and future-proof our application, we have used it as the standard to write our JavaScript in. To make sure that our code is usable in all the browsers though, that still have limited support for ES6, we are using [BabelJS](https://babeljs.io/) to convert the JavaScript into more widely supported ES5. Moreover, as the conversion is done once only, it does not place and extra overhead on the client.


###Styling

During stylesheets creation we wanted to keep in mind the same guidelines that we used for JavaScript development: ease of maintenance and modularity. In order to achieve that we utilized [SASS framework](http://sass-lang.com/). This choice allowed us to extract common styles into meaningful modules that could be included on relevant pages. The use of variables that SASS provides made it easier to extract common styling and later introduce changes quickly. Including this mature processor, backed by a large community and good support made our CSS more manageable.


###Standalone client

In order to be able to quickly test the changes and new functionality on the frontend, as well as develop the client and the server separately, we decided to split them into two separate projects. We needed the option to start the UI without the effort of starting the backend, therefore we introduced [NodeJS](https://nodejs.org/en/) and [ExpressJS](http://expressjs.com/) server to facilitate that. As we were already utilizing pure JavaScript, it was the easiest choice that allowed us to limit the technologies and dependencies we were using. The Node server is very simple and has almost no logic on its own - it serves the files mimicking the behaviour of the real server, but in a static manner, without the complex logic of the real backend. The downside of this approach was the need to always add a similar endpoint to our Node server whenever the real server was changing and putting effort into keeping those two in synch. Also, as we didn't want to devote too much time to the simplified Node server, some error handling functionality was not easily tested on the client project alone as we did not attempt to simulate all the scenarios. Nevertheless the benefits of having a separate client project were far grater and allowed us to achieve a fast development cycle. As fast development cycle was our big focus, we used also [LiveReload](http://livereload.com/) that propagated the changes done during development in the code to the browser without the need to restart the Node server after every change.


##Old browser support

An important focus for us was to design with multiple devices in mind, therefore all the pages are responsive and look just as good on mobile, tablet and desktop. Unfortunately not all old browsers support the features we utilized to make our system easy to use and visually pleasant. In order to make sure that even people using devices without certain features available are able to complete the booking, we took [the BBC approach - cutting the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard). We made sure our website is usable without JavaScript or styling available. We added check to detect old browsers and made sure that the styles used and script code executed gives those users the best experience given the obsolete technologies they are utilizing. This added a bit of overhead as now we have to support 3 different flows (without JS, with old JS, with new JS), but it allows us to maximise the number of users that will be able to navigate our system without problems.


##Testing

When it comes to the testing strategy, we introduced multiple types of tests. We are running JavaScript unit tests, to quickly check correctness of the modules we have. We execute cross-browser tests with the help of [Selenium](http://webdriver.io/), in order to check the ability to complete the booking on multiple operating systems, browser types and versions. This allows us to obtain quick feedback if a change introduced prevents some users from booking an appointment. The downside of this approach is the significant time that those tests take to complete. In order to mitigate that we have selected a couple of representative environments that also targets the biggest subset of our user group and we regularly check against those. This includes IE on Windows, Safari on MacOS and iPhone, Chrome, Firefox.

We did a fair amount of work to make sure that our website is accessible and according to the AA standards. We introduced tests to help us detect straightforward violations to the AA compliance by taking advantage of [pa11y](http://pa11y.org/). We do acknowledge though that it is not a replacement for regular accessibility testing. It is one of the steps we take to make sure our website remains accessible, along with manually testing with multiple screen readers and real users.


##Optimization

Knowing that almost a third of our users are accessing our site through mobile, we kept in mind the page weight during development. We strived to remove unused libraries if they were not essential. We are not using JQuery as we aimed to replace DOM manipulation with rendering appropriate templates. We are not using Bootstrap as we found that the much more lightweight [Skeleton](http://getskeleton.com/) is all we need. According to the best practices, we are minifying and compressing our JavaScript files (though compression happens only when we run the full project with backend). We decided not to include the whole [FontAwesome](https://fortawesome.github.io/Font-Awesome/) library when we realised that all we need is a couple of icons. We keep in mind the size of our website and strive to make it as small as possible. + minify
