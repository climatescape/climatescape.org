const { pgBossQueue, knex, executeKnex } = require("./pg")
const { setupScraping } = require("./setupScraping")
const {
  getTwitterScreenName,
  createTwitterUserObjectScrapingJobData,
} = require("./twitter")

/**
 * @param {string} requestType request type, e. g. "twitterUserObject"
 * @returns {Promise<void>}
 */
async function determineOrgsToScrapeFirstTime(requestType) {
  await setupScraping()
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

/**
 * @param {Object} org from Airtable
 */
async function publishTwitterUserObjectScrapingJob(org) {
  return await pgBossQueue.publish(
    "twitterUserObject",
    createTwitterUserObjectScrapingJobData(org)
  )
}

async function addFirstTimeScrapingJobs() {
  await pgBossQueue.start()
  const orgsToScrape = await determineOrgsToScrapeFirstTime("twitterUserObject")
  const orgsWithTwitter = orgsToScrape.filter(getTwitterScreenName)
  await Promise.all(orgsWithTwitter.map(publishTwitterUserObjectScrapingJob))
}

if (require.main === module) {
  ;(async () => {
    try {
      await addFirstTimeScrapingJobs()
    } catch (e) {
      console.error("Error adding first-time scraping jobs", e)
    }
  })()
}

module.exports = { determineOrgsToScrapeFirstTime, addFirstTimeScrapingJobs }
