const path = require("path")
const fs = require("fs").promises
const { knex, executeKnex } = require("../src/db/pg")
const { setupTables } = require("../src/db/setupTables")
const { backupOrganizations } = require("../src/airtableBackup")

async function truncateAllTables() {
  await setupTables()
  await executeKnex(knex("scraping_results").truncate())
  // Cannot use truncate() because of a foreign key constraint
  await executeKnex(knex("organizations").delete())
}

async function fillSampleOrgData() {
  await truncateAllTables()
  const orgRecords = JSON.parse(
    await fs.readFile(path.resolve(__dirname, "airtableOrgs.json"), "utf-8")
  )
  await backupOrganizations(orgRecords)
}

module.exports = { truncateAllTables, fillSampleOrgData }
