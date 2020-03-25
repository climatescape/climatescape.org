const { setupPgBossQueue } = require("./db/pgBoss")
const { setupTables } = require("./db/setupTables")
const {
  onSuccessfulTwitterUserObjectScraping,
  twitterUserObjectScrapingLoop,
  DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS,
} = require("./twitterUserObjectScraping")
const { DELAY_BETWEEN_AIRTABLE_API_CALLS_MS } = require("./airtable")
const {
  addAirtableEnrichmentJob,
  airtableEnrichmentLoop,
} = require("./airtableEnrichment")
const { isProduction, executeWithFixedDelayAsync } = require("./utils")

/**
 * @param {PgBoss} pgBossQueue
 */
function setupTwitterUserObjectScraping(pgBossQueue) {
  // Don't throttle jobs during integration testing to arrive at the expected
  // results faster
  const twitterUserObjectsScrapingPeriodDelayMs = isProduction
    ? DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS
    : 100
  executeWithFixedDelayAsync(async function doTwitterUserObjectScraping() {
    try {
      await twitterUserObjectScrapingLoop(pgBossQueue)
    } catch (err) {
      console.error("Error in Twitter user object scraping loop", err)
    }
  }, twitterUserObjectsScrapingPeriodDelayMs)
}

/**
 * @param {PgBoss} pgBossQueue
 */
async function setupAirtableEnrichmentHooks(pgBossQueue) {
  await onSuccessfulTwitterUserObjectScraping(
    pgBossQueue,
    async (orgId, orgName) => {
      await addAirtableEnrichmentJob(pgBossQueue, orgId, orgName)
    }
  )
}

/**
 * @param {PgBoss} pgBossQueue
 */
function setupAirtableEnrichment(pgBossQueue) {
  executeWithFixedDelayAsync(async function enrichAirtable() {
    try {
      await airtableEnrichmentLoop(pgBossQueue)
    } catch (err) {
      console.error("Error in Airtable enrichment loop", err)
    }
  }, DELAY_BETWEEN_AIRTABLE_API_CALLS_MS)
}

async function startWorker() {
  const pgBossQueue = await setupPgBossQueue()
  await setupTables()
  await setupAirtableEnrichmentHooks(pgBossQueue)
  setupTwitterUserObjectScraping(pgBossQueue)
  setupAirtableEnrichment(pgBossQueue)
}

;(async () => {
  try {
    await startWorker()
  } catch (err) {
    console.error("Error starting worker", err)
  }
})()
