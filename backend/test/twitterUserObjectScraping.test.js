const waitForExpect = require("wait-for-expect")
const { executeCount } = require("../src/db/pg")
const { setupPgBossQueue } = require("../src/db/pgBoss")
const {
  addTwitterUserObjectScrapingJobs,
  getTwitterScreenName,
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

test("getTwitterScreenName", () => {
  const org = {
    id: "climatescape",
    fields: { Twitter: "https://twitter.com/climatescape" },
  }
  expect(getTwitterScreenName(org)).toBe("climatescape")
  org.fields["Twitter Override"] = "https://twitter.com/climatescape1/"
  expect(getTwitterScreenName(org)).toBe("climatescape1")
})
