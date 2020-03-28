// This file includes logic of backup of Airtable data (currently, only organizations) in Postgres. So far, it is used
// only in addFirstTimeScrapingJobs.js, but, in principle, backup could also be done as part of periodic re-scraping:
// see https://github.com/climatescape/climatescape.org/issues/110.

const { setupTables } = require("./db/setupTables")
const { executeCount, executeBulkInsertOrUpdate } = require("./db/pg")

/**
 * @param {Array<Object>} orgs - array or orgs from Airtable
 * @returns {Promise<number>} the number of rows updated
 */
async function bulkUpsertOrgs(orgs) {
  const now = new Date()
  const insertData = orgs.map(org => ({
    ...org,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }))
  return await executeBulkInsertOrUpdate(
    "organizations",
    insertData,
    ["id"],
    ["fields", "created_at", "updated_at", "deleted_at"]
  )
}

/**
 * @param {Array<Object>} orgs - array of orgs from Airtable
 * @returns {Promise<void>}
 */
async function backupOrgsInDb(orgs) {
  await setupTables()
  const numOrgsBefore = await executeCount("organizations")
  console.log(`Num organizations before backup: ${numOrgsBefore}`)
  console.log("Backing up organizations in Postgres...")
  const numDbRowsUpdated = await bulkUpsertOrgs(orgs)
  if (numDbRowsUpdated !== orgs.length) {
    console.error(
      `Number of rows updated [${numDbRowsUpdated}] != number of orgs [${orgs.length}]`
    )
  }
  const numOrgsAfter = await executeCount("organizations")
  console.log(`Num organizations after backup: ${numOrgsAfter}`)
  console.log(`Saved ${numOrgsAfter - numOrgsBefore} new organizations`)
}

module.exports = { backupOrgsInDb }
