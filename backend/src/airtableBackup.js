const { airtableBase, fetchAllRecords } = require("./airtable")
const { setupTables } = require("./db/setupTables")
const { executeCount, executeBulkInsertOrUpdate } = require("./db/pg")

/**
 * @returns {Promise<Array<Object>>} array of orgs from Airtable
 */
async function fetchAllOrgsFromAirtable() {
  console.log("Fetching organizations from Airtable...")
  const allOrgRecords = await fetchAllRecords(
    airtableBase("Organizations").select()
  )
  // Cleans up irrelevant fields: references to the parent table, callback
  // functions, etc.
  return allOrgRecords.map(orgRecord => {
    return { id: orgRecord.id, fields: orgRecord.fields }
  })
}

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

/**
 * @returns {Promise<void>}
 */
async function fetchAndBackupInDbAllAirtableOrgs() {
  const orgs = await fetchAllOrgsFromAirtable()
  await backupOrgsInDb(orgs)
}

module.exports = { backupOrgsInDb, fetchAndBackupInDbAllAirtableOrgs }
