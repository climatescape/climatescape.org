# Backend Overview
Backend automatically scrapes data for Climatescape website and [pushes the scraped data, along with "Rank" to Airtable
with Climatescape's content](doc/decisions/6-push-data-to-airtable.md).

What's currently being scraped (there results appears as keys in "Enrichment Data" column in the "Organizations" table
in Airtable, and can be used in Gatsby during the website generation):
 - `"twitterUserObject"`: [Twitter user object](
 https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object)

Conceptually, backend can automate many different types of tasks:
 - *First-time scraping* of information for website about organizations just being submitted 
 - [*Periodic re-scraping*](https://github.com/climatescape/climatescape.org/issues/110) of information for website
 about all organizations listed on the website. This is needed because scraped information can become outdated.
 - Automatic sourcing of new organizations or other types of entities for the website
 - Data analysis: e. g. finding similar organizations by comparing the contents of their website front pages, so that
 these organizations can be linked to each other on Climatescape website

And other potential applications! If you want to implement one of the ideas above (or enhance an existing
implementation), or propose something else that can be automated about Climatescape, please [propose it in issues](
https://github.com/climatescape/climatescape.org/issues).

## Backend Architecture
Backend is written in [Node.js](doc/decisions/2-use-node.md) and is deployed on [Heroku](doc/decisions/1-use-heroku.md).
Production setup consists of a single [*worker*](src/worker.js) app for [background processing](
doc/decisions/3-background-task-processing.md).

Scraping tasks for this process are populated by one-off scripts (currently, only [`addFirstTimeScrapingJobs`](
src/addFirstTimeScrapingJobs.js)) which are scheduled for regular run in Heroku, and also by the worker process itself.
See a discussion of this design [here](doc/decisions/3-background-task-processing.md).

A [*web*](src/web.js) app is not intended to be deployed in Heroku: it is currently used only for
[debugging](#debugging-worker).

Postgres database is used for [backing up organizations from Airtable](doc/decisions/7-backup-airtable-organizations.md)
and persisting scraping results. [pg-boss](doc/decisions/4-use-pg-boss-queue.md) queue (which itself runs on top of the
same Postgres database instance) is used as a job manager for worker. Postgres is accessed using
[Knex.js](doc/decisions/8-use-knex.md) as the query builder.

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

### Debugging worker
 1. Start `db` and `web` containers: `docker-compose up -d db web`
 2. Start worker: `node src/worker.js` and attach a debugger to it (or do it within your IDE). Set up breakpoints.
 3. Ping the web to trigger a scraping job that you want to debug, for example
    ```
    curl -X POST https://127.0.0.1:3000/twitterUserObject --header 'Content-type: application/json' --data '{"orgId":"climatescape", "twitterScreenName":"climatescape"}'
    ```

To inspect database contents, enter Postgres container via `docker exec -it backend_db_1 psql -U postgres`. To drop
the database contents completely, run `docker-compose down && docker volume rm backend_dbdata`.

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
