FROM node:latest
MAINTAINER Andy Richardson

ENV NODE_ENV release
ENV HOSTNAME localhost

EXPOSE 80

RUN mkdir -p /var/www/api
WORKDIR /var/www/api

CMD npm install && node bin/www
