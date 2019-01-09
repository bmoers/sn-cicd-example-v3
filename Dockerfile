FROM node:10.13-alpine

LABEL maintainer Boris Moers <boris.moers@gmail.com>

RUN apk --update add git openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*


VOLUME ["/opt/cicd"]

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

#ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production
# RUN npm install --production && mv node_modules ../
COPY . .
EXPOSE 8080 8443
CMD npm update && npm start


