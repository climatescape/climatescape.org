We backup Airtable organizations (see [`airtableBackup`](../../src/airtableBackup.js)) in Postgres.
Alternative path is to determine the organizations requiring first-time scraping directly pulling all organizations from
Airtable.

Organizations are persisted because then we can determine the organization requiring first-time scraping in a single
database query (see [`addFirstTimeScrapingJobs.js`](../../src/addFirstTimeScrapingJobs.js),
`determineOrgsToScrapeFirstTime()` function) rather than a series of queries: one for each organization. The backup is
also a safety net against catastrophic data loss or removal in Airtable.

In the future, two other benefits of the backup are possible:
 - Pulling data from Airtable and determining first-time scraping jobs (or periodic re-scraping jobs) can be decoupled
 between separate processes or cron-scheduled one-off dynos.
 - We can run some ad-hoc or periodic analysis on this data that Airtable's interface and/or API doesn't permit.

See [this message](https://github.com/climatescape/climatescape.org/pull/87#issuecomment-594037797). 