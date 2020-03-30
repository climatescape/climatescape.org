const path = require("path")
const fs = require("fs").promises
const { knex, executeKnex } = require("../src/db/pg")
const { setupTables } = require("../src/db/setupTables")
const { backupOrgsInDb } = require("../src/airtableBackup")

async function truncateAllTables() {
  await setupTables()
  await executeKnex(knex("scraping_results").truncate())
  // Cannot use truncate() because of a foreign key constraint
  await executeKnex(knex("organizations").delete())
}

async function makeSampleOrgs() {
  return JSON.parse(
    await fs.readFile(path.resolve(__dirname, "airtableOrgs.json"), "utf-8")
  )
}

async function loadSampleOrgsIntoDb() {
  await truncateAllTables()
  const orgs = await makeSampleOrgs()
  await backupOrgsInDb(orgs)
}

module.exports = { truncateAllTables, makeSampleOrgs, loadSampleOrgsIntoDb }
