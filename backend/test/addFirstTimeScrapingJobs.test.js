const waitForExpect = require("wait-for-expect")
const { loadSampleOrgsIntoDb } = require("./prepareDb")
const { knex, executeKnex, executeCount } = require("../src/db/pg")
const {
  determineOrgsToScrapeFirstTime,
  addFirstTimeScrapingJobs,
} = require("../src/addFirstTimeScrapingJobs")

describe("determineOrgsToScrapeFirstTime", () => {
  test("basically works", async () => {
    await loadSampleOrgsIntoDb()
    expect(await executeCount("organizations")).toBe(55)
    await executeKnex(
      knex("scraping_results").insert({
        org_id: "rec01lt5ZeLGlwpg2",
        request_type: "twitterUserObject",
        result: { followers_count: 100 },
      })
    )
    const orgsToScrapeFirstTime = await determineOrgsToScrapeFirstTime(
      "twitterUserObject"
    )
    expect(orgsToScrapeFirstTime.length).toBe(54)
  })
})

test("addFirstTimeScrapingJobs", async () => {
  await loadSampleOrgsIntoDb()
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
