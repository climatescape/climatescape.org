const waitForExpect = require("wait-for-expect")
const { addFirstTimeScrapingJobs } = require("../src/addFirstTimeScrapingJobs")
const { fillSampleOrgData } = require("./prepareDb")
const { executeCount } = require("../src/db/pg")

test("addFirstTimeScrapingJobs", async () => {
  await fillSampleOrgData()
  await addFirstTimeScrapingJobs()
  // Waits for the background worker.js process in docker-compose to pick up the scraping jobs and to populate
  // scraping_results table.
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
