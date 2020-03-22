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
 4. **Add `TWITTER_API_KEY` and `TWITTER_API_SECRET` to `../.env.development` config file.** Either use your own
 app's key and secret, or ask @bloudermilk for the Climatescape's credentials.
 5. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop)

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

## Heroku setup

For development, backend could be deployed in any Heroku app, not necessarily the one which belongs to Climatescape.

*From the root project directory*, (i. e. the parent of the `backend/` directory), do:

```
$ heroku git:remote -a <name-of-your-heroku-app>
$ heroku addons:create heroku-postgres
# heroku addons:create scheduler
$ heroku plugins:install heroku-config
$ heroku config:push -f .env.development
$ heroku config:set NPM_CONFIG_AUDIT=false
$ heroku config:set NPM_CONFIG_DRY_RUN=true
$ git push heroku master
$ heroku ps:scale worker=1
$ heroku addons:open scheduler
```
Then, in the opened web interface, add `cd backend && node src/addFirstTimeScrapingJobs.js` as a job to be run every
10 minutes.
