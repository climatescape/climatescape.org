const waitForExpect = require("wait-for-expect")
const { executeCount } = require("../src/db/pg")
const { setupPgBossQueue } = require("../src/db/pgBoss")
const {
  addFirstTimeTwitterUserObjectScrapingJobs,
} = require("../src/twitterUserObjectScraping")
const { fillSampleOrgData } = require("./prepareDb")

test("addFirstTimeTwitterUserObjectScrapingJobs", async () => {
  await fillSampleOrgData()
  const pgBossQueue = await setupPgBossQueue()
  await addFirstTimeTwitterUserObjectScrapingJobs(pgBossQueue)
  await waitForExpect(
    async () => {
      const numScrapingResults = await executeCount("scraping_results")
      console.log(numScrapingResults)
      expect(numScrapingResults).toBe(39)
    },
    9500, // timeout
    500 // interval
  )
}, 10000)
