const waitForExpect = require("wait-for-expect")
const { addFirstTimeScrapingJobs } = require("../src/addFirstTimeScrapingJobs")
const { fillSampleOrgData } = require("./prepareDb")
const { executeCount } = require("../src/db/pg")

test("addFirstTimeScrapingJobs", async () => {
  await fillSampleOrgData()
  await addFirstTimeScrapingJobs()
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
