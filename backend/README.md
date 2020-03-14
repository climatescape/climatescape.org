# Backend
Backend automatically scrapes data for Climatescape website.

## Overview
Backend is written in [Node.js](doc/decisions/2-use-node.md) and is deployed on [Heroku](doc/decisions/1-use-heroku.md).
It consists of two apps: *web* (shouldn't be confused with Climatescape website itself) and *worker* for [background
processing](doc/decisions/3-background-task-processing.md). web pushes jobs to a persistent [pg-boss](
doc/decisions/4-use-pg-boss-queue.md) queue backed up with Postgres.

## Local setup

 1. Install Node 12.15.0 using [`nvm`](https://github.com/nvm-sh/nvm#install--update-script)
 2. [Install yarn 1.x](https://classic.yarnpkg.com/en/docs/install)
 3. run `yarn install`
 4. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop)

If you have problems installing dependencies (running `yarn` command) on Mac OS, try the following:
 1. Follow instructions on [this page](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md)
 2. `brew install libpq` and follow instructions about modifying `PATH`, `LDFLAGS`, `CPPFLAGS`, and `PKG_CONFIG_PATH`
 variables printed by Homebrew in the end of the installation.

Run tests via `yarn test`.

For faster testing or debug loop, first start `db` and `worker` containers separately: `docker-compose up -d db worker`,
and then run `yarn jest`.

For full formation testing, use `docker-compose up -d` and ping the web via
```
curl -X POST https://127.0.0.1:3000/twitterUserObject --header 'Content-type: application/json' --data '{"orgId":"climatescape", "twitterScreenName":"climatescape"}'
```
To enter Postgres container for debugging, use `docker exec -it backend_db_1 psql -U postgres`
