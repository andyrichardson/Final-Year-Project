FROM node:argon
MAINTAINER Andy Richardson

ENV NODE_ENV release
ENV HOSTNAME localhost

EXPOSE 80

RUN mkdir -p /var/www/web
WORKDIR /var/www/web

CMD npm install && node bin/www
