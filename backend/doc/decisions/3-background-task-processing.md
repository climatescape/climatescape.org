The automatic data scraping system [deployed on Heroku](1-use-heroku.md) is organized as follows:

 1. A "worker" dyno processes jobs (scraping tasks) from queue(s) in background.
 2. Scraping tasks are populated to the queue(s) via [one-off dynos](
 https://devcenter.heroku.com/articles/one-off-dynos) which are scheduled to be run periodically via [Heroku
 Scheduler](https://devcenter.heroku.com/articles/scheduler). For example, a one-off script can pull the data from the
 Climatescape's Airtable and schedule initial scraping tasks for newly added orgs.

This decision to use a background worker with task queue(s) is driven by the [Heroku
documentation](https://devcenter.heroku.com/articles/background-jobs-queueing) which justifies this approach as scalable
and reliable. worker fetches the scraping tasks in background, does the scraping (e. g. accesses Twitter API), and puts
the results into the Postgres database.

As an alternative to the "pull approach" (scraping tasks are populated by scheduled one-off dynos), a "push approach"
was considered: the backend maintains a web interface (on a separate dyno) which Climatescape website (via [Netlify
Functions](https://docs.netlify.com/functions/overview)) or [Zapier](https://zapier.com/home).

The pull-based approach was chosen because it has the following advantages:
 - The dependency on Netlify Functions or Zapier can be avoided, reducing the number of concepts that developers have to
 learn and environments to manage. On the other hand, even with the push approach, one-off scripts in Heroku could be
 needed anyway to schedule periodic re-scraping of information about all organizations.
 - The backend doesn't need to expose a POST or PUT interface, so no need to worry about protection and authentication.
 Some form of backend web interface might be eventually added, e. g. for monitoring of the number of scraping tasks in
 the queue(s), but that interface could probably be read-only so authentication might not be required.

The decision to use background worker was done [here](
https://github.com/climatescape/climatescape.org/issues/40#issuecomment-584658556) (see also a few preceding messages in
that thread), with the push-based approach. Then, we decided to use the pull-based instead of push-based approach in
[this discussion](https://github.com/climatescape/climatescape.org/pull/87#discussion_r383368702).
