const { prepareEnrichmentFields } = require("../src/airtableEnrichment")
const { loadSampleOrgsIntoDb } = require("./prepareDb")
const { knex, executeKnex } = require("../src/db/pg")

describe("prepareEnrichmentFields", () => {
  beforeAll(loadSampleOrgsIntoDb)
  test("happy path", async () => {
    await executeKnex(
      knex("scraping_results").insert({
        org_id: "rec01lt5ZeLGlwpg2",
        request_type: "twitterUserObject",
        result: { followers_count: 100 },
      })
    )
    const enrichmentFields = await prepareEnrichmentFields({
      orgId: "rec01lt5ZeLGlwpg2",
      orgName: "AltaRock Energy",
    })
    expect(enrichmentFields.Rank).toBe(100)
    expect(
      enrichmentFields["Enrichment Data"].twitterUserObject.followers_count
    ).toBe(100)
  })

  test("throwing Error if scraping results are absent", async () => {
    await expect(
      prepareEnrichmentFields({
        orgId: "rec081khvBlMTCTcd",
        orgName: "Energy Source",
      })
    ).rejects.toThrowError(/No scraping results for .*/)
  })
})
