const path = require("path")
const fs = require("fs").promises
const { knex, executeKnex, executeCount } = require("../src/db/pg")
const { backupOrganizations } = require("../src/backupAirtable")
const { truncateAllTables } = require("./prepareDb")

describe("backupOrganizations", () => {
  beforeEach(truncateAllTables)
  test("un-deletes deleted orgs", async () => {
    const orgRecords = JSON.parse(
      await fs.readFile(path.resolve(__dirname, "airtableOrgs.json"), "utf-8")
    )
    await backupOrganizations(orgRecords) // First backup.
    const numOrgs = await executeCount("organizations")
    console.log(`Num orgs: ${numOrgs}`)
    // Delete one org.
    await executeKnex(
      knex("organizations")
        .update({ deleted_at: new Date() })
        .where({ id: "rec01lt5ZeLGlwpg2" })
    )
    await backupOrganizations(orgRecords) // Second backup.
    const numOrgs2 = await executeCount("organizations")
    console.log(`Num orgs: ${numOrgs2}`)
    expect(numOrgs, "Second backup should un-delete an org").toBe(numOrgs2)
  })
})
