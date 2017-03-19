FROM node:latest
MAINTAINER Andy Richardson

ENV NODE_ENV test
ENV HOSTNAME localhost

EXPOSE 80

RUN mkdir -p /var/www/web
WORKDIR /var/www/web

CMD npm install --production && npm run bundle && npm run web-server
