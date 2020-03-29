// This file is an executable Node script containing the logic of the background worker (see decision
// 3-background-task-processing.md). This script runs indefinitely and never finishes. The script fetches and performs
// different types of jobs from pg-boss queue (see decision 4-use-pg-boss-queue.md) in background loops (see functions
// with names like setup...Loop() below). Internally, the script leverages pg-boss's job completion hooks to decouple
// different types of tasks: see setupAirtableEnrichmentHooks().

const { setupPgBossQueue } = require("./db/pgBoss")
const { setupTables } = require("./db/setupTables")
const {
  onSuccessfulTwitterUserObjectScraping,
  processTwitterUserObjectScrapingJobs,
  DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS,
} = require("./twitterUserObjectScraping")
const { DELAY_BETWEEN_AIRTABLE_API_CALLS_MS } = require("./api/airtable")
const {
  addAirtableEnrichmentJob,
  processAirtableEnrichmentJobs,
} = require("./airtableEnrichment")
const { isProduction, executeWithFixedDelayAsync } = require("./utils")

/**
 * Sets up background fetch and processing of Twitter user object scraping jobs (see twitterUserObjectScraping.js).
 * @param {PgBoss} pgBossQueue
 */
function setupTwitterUserObjectScrapingLoop(pgBossQueue) {
  // Don't throttle jobs during integration testing to arrive at the expected
  // results faster
  const twitterUserObjectsScrapingPeriodDelayMs = isProduction
    ? DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS
    : 100
  // Can't use pgBossQueue.subscribe() for now because there is no support for throttling in the library, especially
  // the kind of throttling that doesn't take the execution time of the handler into account (see the doc comment for
  // executeWithFixedDelayAsync()).
  executeWithFixedDelayAsync(async function doTwitterUserObjectScraping() {
    try {
      await processTwitterUserObjectScrapingJobs(pgBossQueue)
    } catch (err) {
      console.error("Error in Twitter user object scraping loop", err)
    }
  }, twitterUserObjectsScrapingPeriodDelayMs)
}

/**
 * Sets up background fetch and processing of Airtable enrichment jobs (see airtableEnrichment.js).
 * @param {PgBoss} pgBossQueue
 */
function setupAirtableEnrichmentLoop(pgBossQueue) {
  // Can't use pgBossQueue.subscribe() for now because there is no support for throttling in the library, especially
  // the kind of throttling that doesn't take the execution time of the handler into account (see the doc comment for
  // executeWithFixedDelayAsync()).
  executeWithFixedDelayAsync(async function enrichAirtable() {
    try {
      await processAirtableEnrichmentJobs(pgBossQueue)
    } catch (err) {
      console.error("Error in Airtable enrichment loop", err)
    }
  }, DELAY_BETWEEN_AIRTABLE_API_CALLS_MS)
}

/**
 * Sets up triggers for enriching Airtable (see airtableEnrichment.js) upon successful completion of scraping tasks
 * (when, therefore, the data needed for enrichment is stored in Postgres).
 *
 * @param {PgBoss} pgBossQueue
 */
async function setupAirtableEnrichmentHooks(pgBossQueue) {
  // Currently this function contains just one call: onSuccessfulTwitterUserObjectScraping(), but in the future, when
  // more types of scraping jobs are added (like Crunchbase), another call to onSuccessfulCrunchbaseScraping() should
  // be added, etc.
  await onSuccessfulTwitterUserObjectScraping(
    pgBossQueue,
    async (orgId, orgName) => {
      await addAirtableEnrichmentJob(pgBossQueue, orgId, orgName)
    }
  )
}

async function startWorker() {
  const pgBossQueue = await setupPgBossQueue()
  await setupTables()
  await setupAirtableEnrichmentHooks(pgBossQueue)
  setupTwitterUserObjectScrapingLoop(pgBossQueue)
  setupAirtableEnrichmentLoop(pgBossQueue)
}

;(async () => {
  try {
    await startWorker()
  } catch (err) {
    console.error("Error starting worker", err)
  }
})()
