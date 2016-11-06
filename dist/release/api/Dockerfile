FROM node:argon
MAINTAINER Andy Richardson

ENV NODE_ENV production

COPY keys/id_rsa /root/.ssh/id_rsa

RUN mkdir /var/www
WORKDIR /var/www/

EXPOSE 80

RUN mkdir -p /var/www/api
WORKDIR /var/www/api
