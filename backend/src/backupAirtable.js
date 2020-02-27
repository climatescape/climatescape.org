const { airtableBase, fetchAllRecords } = require("./airtable")
const setupAirtableBackup = require("./setupAirtableBackup")

function verifyOrgsNotDeletedAfterBulkCreate(orgs) {
  for (const org in orgs) {
    if (org.deletedAt) {
      throw new Error(
        `Org ${org.toJSON()} appears to be deleted after bulkCreate. This should be a bug in Sequelize.`
      )
    }
  }
}

async function backupOrganizations() {
  const Organization = await setupAirtableBackup()
  console.log("Fetching organizations from Airtable...")
  const allOrgRecords = await fetchAllRecords(
    airtableBase("Organizations").select()
  )
  const allOrgRecordsForPg = allOrgRecords.map(orgRecord => {
    return { id: orgRecord.id, fields: orgRecord.fields }
  })
  const numOrgsBefore = await Organization.count()
  console.log("Backing up organizations in Postgres...")
  const orgs = await Organization.bulkCreate(allOrgRecordsForPg, {
    validate: true,
    returning: true,
    logging: false,
  })
  verifyOrgsNotDeletedAfterBulkCreate(orgs) // sanity check
  const numOrgsAfter = await Organization.count()
  console.log(`Saved ${numOrgsAfter - numOrgsBefore} new organizations`)
}

;(async () => {
  try {
    await backupOrganizations()
  } catch (e) {
    console.error("Error backing up organizations", e)
  }
})()
