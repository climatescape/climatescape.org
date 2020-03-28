const { airtableBase, fetchAllRecords } = require("./airtable")
const { setupTables } = require("./db/setupTables")
const { executeCount, executeBulkInsertOrUpdate } = require("./db/pg")

/**
 * @returns {Promise<Array<Object>>} array of orgs from Airtable
 */
async function fetchAllOrgRecordsFromAirtable() {
  console.log("Fetching organizations from Airtable...")
  const allOrgRecords = await fetchAllRecords(
    airtableBase("Organizations").select()
  )
  return allOrgRecords.map(orgRecord => {
    return { id: orgRecord.id, fields: orgRecord.fields }
  })
}

/**
 * @param {Array<Object>} orgs - array or orgs from Airtable
 * @returns {Promise<number>} the number of rows updated
 */
async function bulkUpsertOrganizations(orgs) {
  const now = new Date()
  const insertData = orgs.map(orgRecord => ({
    ...orgRecord,
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
async function backupOrganizations(orgs) {
  await setupTables()
  const numOrgsBefore = await executeCount("organizations")
  console.log(`Num organizations before backup: ${numOrgsBefore}`)
  console.log("Backing up organizations in Postgres...")
  const numDbRowsUpdated = await bulkUpsertOrganizations(orgs)
  if (numDbRowsUpdated !== orgs.length) {
    console.error(
      `Number of rows updated [${numDbRowsUpdated}] != number of org records [${orgs.length}]`
    )
  }
  const numOrgsAfter = await executeCount("organizations")
  console.log(`Num organizations after backup: ${numOrgsAfter}`)
  console.log(`Saved ${numOrgsAfter - numOrgsBefore} new organizations`)
}

/**
 * @returns {Promise<void>}
 */
async function fetchAndBackupAllAirtableOrganizations() {
  const allOrgRecords = await fetchAllOrgRecordsFromAirtable()
  await backupOrganizations(allOrgRecords)
}

module.exports = { backupOrganizations, fetchAndBackupAllAirtableOrganizations }
