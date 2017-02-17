FROM node:argon
MAINTAINER Andy Richardson

ENV NODE_ENV release
ENV PORT 80

EXPOSE 80

RUN mkdir -p /var/www/auth
WORKDIR /var/www/auth

CMD npm install && node bin/www
