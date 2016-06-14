#!/usr/bin/env bash

set -ef -o pipefail

kill_all_the_whales() {
    if [ ! -z "$(docker ps -aq)" ]; then
        docker rm -f $(docker ps -aq)
    fi
}

start() {
    prebuild
    docker-compose up app
}

dev() {
    prebuild
    docker-compose up dev
}

test() {
    prebuild
    docker-compose run test
}

uitest() {
    prebuild
    BROWSER=chrome docker-compose run uitest
    BROWSER=chrome docker-compose down

    BROWSER=firefox docker-compose run uitest
    BROWSER=firefox docker-compose down
}

cross_browser_test() {
    prebuild
    docker-compose run cross-browser-test
}

prebuild() {
    npm install
}

case "$1" in
    start)
        start
        ;;
    dev)
        dev
        ;;
    test)
        test
        ;;
    uitest)
        uitest
        ;;
    cross_browser_test)
        cross_browser_test
        ;;
    kill_all_the_whales)
        kill_all_the_whales
        exit 0
        ;;
    *)
        echo $"Usage: $0 {start|dev|test|uitest|cross_browser_test|kill_all_the_whales}"
        exit 1
esac

if [ -z "$CI" ] || [ "$CI" != "true" ]; then
    kill_all_the_whales
fi
