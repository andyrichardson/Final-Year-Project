FROM node:argon
MAINTAINER Andy Richardson

ENV NODE_ENV development
ENV PORT 80

EXPOSE 80

RUN echo 'deb http://download.opensuse.org/repositories/shells:\
/fish:/release:/2/Debian_8.0/ /' >> /etc/apt/sources.list.d/fish.list && \
apt-get update && \
apt-get install -y --force-yes fish && \
npm install -g nodemon

RUN mkdir -p /var/www/auth
WORKDIR /var/www/auth

CMD /usr/bin/fish
