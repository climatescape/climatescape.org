const { pgBossQueue, executeInsertOrUpdate } = require("./pg")
const { setupScraping } = require("./setupScraping")
const { scrapeTwitterFollowers } = require("./twitter")
const { isProduction } = require("./utils")

/**
 * @param {string} jobId
 * @param {{orgId: string, orgName: string, twitterFollowers: number}} orgData
 * @returns {Promise<void>}
 */
async function storeTwitterFollowers(jobId, orgData) {
  try {
    const now = new Date()
    await executeInsertOrUpdate(
      "scraping_results",
      {
        org_id: orgData.orgId,
        request_type: "twitterFollowers",
        created_at: now,
      },
      {
        updated_at: now,
        result: orgData.twitterFollowers,
      }
    )
    console.log(
      `Twitter followers for ${JSON.stringify(
        orgData
      )} were successfully stored in the database`
    )
    await pgBossQueue.complete(jobId)
  } catch (err) {
    console.error(
      `Error while storing twitter followers for ${JSON.stringify(
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
const MAX_ACCOUNTS_PER_TWITTER_FOLLOWERS_API_CALL = 100

async function twitterFollowersLoop() {
  const jobs = await pgBossQueue.fetch(
    "twitterFollowers",
    MAX_ACCOUNTS_PER_TWITTER_FOLLOWERS_API_CALL
  )
  if (!jobs) {
    return
  }
  let orgsWithTwitterFollowers
  try {
    orgsWithTwitterFollowers = await scrapeTwitterFollowers(jobs)
  } catch (err) {
    console.error(
      `Error scraping Twitter followers for ${JSON.stringify(jobs)}`,
      err
    )
    await pgBossQueue.fail(jobs.map(job => job.id))
    return
  }
  await Promise.all(
    orgsWithTwitterFollowers.map((orgData, i) =>
      storeTwitterFollowers(jobs[i].id, orgData)
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
      await twitterFollowersLoop()
    } catch (err) {
      console.log("Error in Twitter followers scraping loop", err)
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
