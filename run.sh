#!/bin/sh
docker kill happy-app
docker rm happy-app
docker run --name=happy-app -it -p 5000:3000 -v `(pwd)`:"/opt/cognizant/happy-app" happy-app:`(git rev-parse --short HEAD)` 
