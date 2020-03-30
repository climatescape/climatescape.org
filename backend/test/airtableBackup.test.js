const { knex, executeKnex, executeCount } = require("../src/db/pg")
const { backupOrgsInDb } = require("../src/airtableBackup")
const { truncateAllTables, makeSampleOrgs } = require("./prepareDb")

describe("backupOrgsInDb", () => {
  beforeEach(truncateAllTables)
  test("un-deletes deleted orgs", async () => {
    const orgs = await makeSampleOrgs()
    await backupOrgsInDb(orgs) // First backup.
    const numOrgs = await executeCount("organizations")
    console.log(`Num orgs: ${numOrgs}`)
    // Delete one org.
    await executeKnex(
      knex("organizations")
        .update({ deleted_at: new Date() })
        .where({ id: "rec01lt5ZeLGlwpg2" })
    )
    await backupOrgsInDb(orgs) // Second backup.
    const numOrgs2 = await executeCount("organizations")
    console.log(`Num orgs: ${numOrgs2}`)
    expect(numOrgs, "Second backup should un-delete an org").toBe(numOrgs2)
  })
})
