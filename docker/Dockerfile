FROM mhart/alpine-node:5

WORKDIR /app

ADD package.json /app/package.json

RUN \
  apk update && \
  apk add git python make g++ && \
  npm config set progress false && \
  npm install -d node-sass && \
  apk del git python make g++ && \
  rm -rf /var/cache/apk/*

VOLUME /app

ENV PORT 3000
EXPOSE 3000 35729

CMD ["npm", "run", "dev"]
