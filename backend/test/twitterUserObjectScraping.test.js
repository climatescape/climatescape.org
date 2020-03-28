const waitForExpect = require("wait-for-expect")
const { executeCount } = require("../src/db/pg")
const { setupPgBossQueue } = require("../src/db/pgBoss")
const {
  addTwitterUserObjectScrapingJobs,
} = require("../src/twitterUserObjectScraping")
const { makeSampleOrgs } = require("./prepareDb")

test("addTwitterUserObjectScrapingJobs", async () => {
  const pgBossQueue = await setupPgBossQueue()
  const orgs = await makeSampleOrgs()
  await addTwitterUserObjectScrapingJobs(pgBossQueue, orgs)
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
