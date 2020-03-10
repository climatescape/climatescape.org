const { pgBossQueue, executeInsertOrUpdate } = require("./pg")
const { setupScraping } = require("./setupScraping")
const { scrapeTwitterUserObjects } = require("./twitter")
const { isProduction } = require("./utils")

/**
 * @param {string} jobId
 * @param {{orgId: string, orgName: string, twitterUserObject: Object}} orgData
 * @returns {Promise<void>}
 */
async function storeTwitterUserObject(jobId, orgData) {
  try {
    const now = new Date()
    await executeInsertOrUpdate(
      "scraping_results",
      {
        org_id: orgData.orgId,
        request_type: "twitterUserObject",
        created_at: now,
      },
      {
        updated_at: now,
        result: orgData.twitterUserObject,
      }
    )
    console.log(
      `Twitter user object for ${JSON.stringify(
        orgData
      )} was successfully stored in the database`
    )
    await pgBossQueue.complete(jobId)
  } catch (err) {
    console.error(
      `Error while storing twitter user object for ${JSON.stringify(
        orgData
      )} in the database`,
      err
    )
    await pgBossQueue.fail(jobId, err)
  }
}

/**
 * This limit is documented here:
 * https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
 * @type {number}
 */
const MAX_ACCOUNTS_PER_TWITTER_USERS_LOOKUP_API_CALL = 100

async function twitterUserObjectScrapingLoop() {
  const jobs = await pgBossQueue.fetch(
    "twitterUserObject",
    MAX_ACCOUNTS_PER_TWITTER_USERS_LOOKUP_API_CALL
  )
  if (!jobs) {
    return
  }
  let orgsWithTwitterUserObjects
  try {
    orgsWithTwitterUserObjects = await scrapeTwitterUserObjects(jobs)
  } catch (err) {
    console.error(
      `Error scraping Twitter user objects for ${JSON.stringify(jobs)}`,
      err
    )
    await pgBossQueue.fail(jobs.map(job => job.id))
    return
  }
  await Promise.all(
    orgsWithTwitterUserObjects.map((orgData, i) =>
      storeTwitterUserObject(jobs[i].id, orgData)
    )
  )
}

async function startWorker() {
  await pgBossQueue.start()
  await setupScraping()
  // Don't throttle jobs during integration testing to arrive at the expected
  // results faster
  const scrapingPeriodDelayMs = isProduction ? 10000 : 100
  setTimeout(async function doWork() {
    try {
      await twitterUserObjectScrapingLoop()
    } catch (err) {
      console.log("Error in Twitter user object scraping loop", err)
    }
    setTimeout(doWork, scrapingPeriodDelayMs)
  }, scrapingPeriodDelayMs)
}

;(async () => {
  try {
    await startWorker()
  } catch (e) {
    console.error("Error starting worker", e)
  }
})()
