const { pgBossQueue, executeInsertOrUpdate } = require("./pg")
const { setupScraping } = require("./setupScraping")

async function twitterFollowers(data) {
  return 100
}

async function startWorker() {
  await pgBossQueue.start()
  await setupScraping()
  await pgBossQueue.subscribe("twitterFollowers", async job => {
    const { data } = job
    console.log(`Scraping Twitter followers: ${JSON.stringify(data)}`)
    const numTwitterFollowers = await twitterFollowers(data)
    console.log(`Twitter followers of ${data.orgId}: ${numTwitterFollowers}`)
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
  })
}

;(async () => {
  try {
    await startWorker()
  } catch (e) {
    console.error("Error starting worker", e)
  }
})()
