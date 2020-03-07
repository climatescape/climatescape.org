const { pgBossQueue, executeInsertOrUpdate } = require("./pg")
const { setupScraping } = require("./setupScraping")
const { scrapeTwitterFollowers } = require("./twitter")
const { isProduction } = require("./utils")

async function scrapeAndStoreTwitterFollowers(job) {
  const { data } = job
  const numTwitterFollowers = await scrapeTwitterFollowers(data)
  try {
    const now = new Date()
    await executeInsertOrUpdate(
      "scraping_results",
      {
        org_id: data.orgId,
        request_type: "twitterFollowers",
        created_at: now,
      },
      {
        updated_at: now,
        result: numTwitterFollowers,
      }
    )
    console.log(
      `Twitter followers for ${data.orgId} were successfully stored in the database`
    )
  } catch (e) {
    console.error(
      `Error while storing twitter followers for ${data.orgId} in the database`,
      e
    )
    throw e
  }
}

async function startWorker() {
  await pgBossQueue.start()
  await setupScraping()
  // Don't throttle jobs during integration testing to arrive at the expected
  // results faster
  const options = {
    teamSize: isProduction ? 1 : 100,
    newJobCheckInterval: isProduction ? 1000 : 100,
  }
  await pgBossQueue.subscribe(
    "twitterFollowers",
    options,
    scrapeAndStoreTwitterFollowers
  )
}

;(async () => {
  try {
    await startWorker()
  } catch (e) {
    console.error("Error starting worker", e)
  }
})()
