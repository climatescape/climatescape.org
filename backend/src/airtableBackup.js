const { airtableBase, fetchAllRecords } = require("./airtable")
const { setupAirtableBackup } = require("./db/setupAirtableBackup")
const { executeCount, executeBulkInsertOrUpdate } = require("./db/pg")

/**
 * @returns {Promise<Array<Object>>}
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
 * @param {Array<Object>} allOrgRecords
 * @returns {Promise<number>} the number of rows updated
 */
async function bulkUpsertOrganizations(allOrgRecords) {
  const now = new Date()
  const insertData = allOrgRecords.map(orgRecord => ({
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
 * @param {Array<Object>} allOrgRecords
 * @returns {Promise<void>}
 */
async function backupOrganizations(allOrgRecords) {
  await setupAirtableBackup()
  const numOrgsBefore = await executeCount("organizations")
  console.log(`Num organizations before backup: ${numOrgsBefore}`)
  console.log("Backing up organizations in Postgres...")
  const numDbRowsUpdated = await bulkUpsertOrganizations(allOrgRecords)
  if (numDbRowsUpdated !== allOrgRecords.length) {
    console.error(
      `Number of rows updated [${numDbRowsUpdated}] != number of org records [${allOrgRecords.length}]`
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
