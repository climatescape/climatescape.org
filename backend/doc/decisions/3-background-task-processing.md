Decided to split the automatic data scraping system [deployed on Heroku](1-use-heroku.md) into two dynos:
 1. "web" (should not to be confused with the Climatescape website itself)
 2. "worker", which does the scraping in background.

web is expected to be called from the hooks on the Climatescape website or Zapier. web puts scraping jobs into
a persistent queue and responds to the caller immediately. worker fetches the jobs in background, does the scraping
(e. g. accesses Twitter API), and puts the results into a Postgres database.

This decision is driven by the [Heroku documentation](https://devcenter.heroku.com/articles/background-jobs-queueing)
which justifies this approach as scalable and reliable.

See [this message](https://github.com/climatescape/climatescape.org/issues/40#issuecomment-584658556) and a few
preceding messages in the thread. See also [this discussion](
https://github.com/climatescape/climatescape.org/pull/87#discussion_r383368702).
