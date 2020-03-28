const { knex, executeKnex } = require("./db/pg")
const { setupTables } = require("./db/setupTables")
const { setupPgBossQueue } = require("./db/pgBoss")
const {
  TWITTER_USER_OBJECT,
  addTwitterUserObjectScrapingJobs,
} = require("./twitterUserObjectScraping")
const { fetchAndBackupInDbAllAirtableOrgs } = require("./airtableBackup")

/**
 * @param {string} requestType request type, e. g. "twitterUserObject"
 * @returns {Promise<Array<{id: string, fields: Object}>>} array of Airtable org
 * objects
 */
async function determineOrgsToScrapeFirstTime(requestType) {
  await setupTables()
  const lastResultsByRequestTypeQuery = knex("scraping_results")
    .select("org_id", "result as last_result")
    .distinctOn("org_id")
    .where({ request_type: requestType })
    .orderBy(["org_id", { column: "updated_at", order: "desc" }])
    .as("last_results")
  const orgsToScrapeQuery = knex("organizations")
    .select("id", "fields")
    .leftOuterJoin(
      lastResultsByRequestTypeQuery,
      "organizations.id",
      "last_results.org_id"
    )
    .whereNull("last_result")
  return await executeKnex(orgsToScrapeQuery)
}

async function addFirstTimeScrapingJobs() {
  const pgBossQueue = await setupPgBossQueue()
  const orgsToScrapeFirstTime = await determineOrgsToScrapeFirstTime(
    TWITTER_USER_OBJECT
  )
  await addTwitterUserObjectScrapingJobs(pgBossQueue, orgsToScrapeFirstTime)
  await pgBossQueue.stop()
}

if (require.main === module) {
  ;(async () => {
    try {
      await fetchAndBackupInDbAllAirtableOrgs()
    } catch (err) {
      console.error("Error backing up Airtable organizations", err)
    }
    try {
      await addFirstTimeScrapingJobs()
    } catch (err) {
      console.error("Error adding first-time scraping jobs", err)
    }
  })()
  // It's unknown why the process doesn't exit itself, maybe because of pgPool
  process.exit(0)
}

// For tests
module.exports = {
  determineOrgsToScrapeFirstTime,
  addFirstTimeScrapingJobs,
}
