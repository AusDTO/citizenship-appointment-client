#!/usr/bin/env bash

set -ef -o pipefail

case "$1" in
        test)
            docker-compose run test
            ;;
        uitest)
            BROWSER=chrome docker-compose run uitest
            BROWSER=chrome docker-compose down

            BROWSER=firefox docker-compose run uitest
            BROWSER=firefox docker-compose down
            ;;
        *)
            echo $"Usage: $0 {test|uitest}"
            exit 1
esac
