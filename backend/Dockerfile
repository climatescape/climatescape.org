# The version should stay in sync with package.json
# -alpine version doesn't work because yarn needs Python during installation of packages
FROM node:12.15.0

# Install app dependencies.
COPY package.json yarn.lock ./

# ignore-engines to skip trying to install fsevents on Linux
RUN yarn config set ignore-engines true && yarn install

RUN yarn global add pm2
