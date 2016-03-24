#!/usr/bin/env bash

set -ef -o pipefail

kill_all_the_whales() {
    docker rm -f $(docker ps -aq)
}

test() {
    docker-compose run test
}

uitest() {
    BROWSER=chrome docker-compose run uitest
    BROWSER=chrome docker-compose down

    BROWSER=firefox docker-compose run uitest
    BROWSER=firefox docker-compose down
}

cross_browser_test() {
    docker-compose run cross-browser-test
}

case "$1" in
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
        ;;
    *)
        echo $"Usage: $0 {test|uitest|cross_browser_test|kill_all_the_whales}"
        exit 1
esac

if [ -z "$CI" ] || [ "$CI" != "true" ]; then
    kill_all_the_whales
fi
