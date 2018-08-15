FROM node:alpine

RUN apk update && apk upgrade

RUN mkdir -p /opt/cognizant/happy-app
WORKDIR /opt/cognizant/happy-app

COPY ./lib /opt/cognizant/happy-app/lib
COPY ./package.json /opt/cognizant/happy-app/package.json

RUN cd /opt/cognizant/happy-app && npm install

EXPOSE 3000

CMD node ./lib/main.js
