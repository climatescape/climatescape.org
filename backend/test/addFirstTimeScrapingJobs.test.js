const waitForExpect = require("wait-for-expect")
const {
  determineOrgsToScrapeFirstTime,
  addFirstTimeScrapingJobs,
} = require("../src/addFirstTimeScrapingJobs")
const { fillSampleOrgData } = require("./prepareDb")
const { knex, executeKnex, executeCount } = require("../src/pg")

describe("determineOrgsToScrapeFirstTime", () => {
  test("basically works", async () => {
    await fillSampleOrgData()
    expect(await executeCount("organizations")).toBe(55)
    await executeKnex(
      knex("scraping_results").insert({
        org_id: "rec01lt5ZeLGlwpg2",
        request_type: "twitterFollowers",
        result: 100,
      })
    )
    const orgsToScrapeFirstTime = await determineOrgsToScrapeFirstTime(
      "twitterFollowers"
    )
    expect(orgsToScrapeFirstTime.length).toBe(54)
  })
})

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
