In order to make use of the scraping results in the Gatsby-generated Climatescape website, we decided to push the
scraped data back to Airtable in the [background worker](3-background-task-processing.md), *in addition* to storing this
data in the Postgres database.

An alternative approach is to connect Gatsby to Postgres via [gatsby-source-pg](
https://www.gatsbyjs.org/packages/gatsby-source-pg/) plugin.

We chose pushing data to Airtable from the backend to simplify the Gatsby setup, considering that some data pushing from
backend to Airtable is needed anyway to enable sorting the organizations in the Airtable content management interface
according to their weight ("Rank"), which is [one of the goals of the scraping automation project](
https://github.com/climatescape/climatescape.org/issues/40#issue-558680900).

See [this message](https://github.com/climatescape/climatescape.org/pull/87#issuecomment-590864830).