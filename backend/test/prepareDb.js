const path = require("path")
const fs = require("fs").promises
const { knex, executeKnex } = require("../src/pg")
const { setupAirtableBackup } = require("../src/setupAirtableBackup")
const { setupScraping } = require("../src/setupScraping")
const { backupOrganizations } = require("../src/backupAirtable")

async function truncateAllTables() {
  await setupAirtableBackup()
  await setupScraping()
  // Cannot use truncate() because of foreign key constraints
  await executeKnex(knex("scraping_results").delete())
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
