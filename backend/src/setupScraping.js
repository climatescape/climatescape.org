const { knex, executeKnex } = require("./pg")
const { setupAirtableBackup } = require("./setupAirtableBackup")

async function setupScraping() {
  const tableExists = await executeKnex(
    knex.schema.hasTable("scraping_results")
  )
  if (!tableExists) {
    await setupAirtableBackup()
    const createTable = knex.schema.createTable("scraping_results", table => {
      table.text("org_id").notNullable()
      table.text("request_type").notNullable()
      table.timestamps(false, true) // Adds created_at, updated_at columns
      table.jsonb("result").notNullable()
      table.primary(["org_id", "request_type", "created_at"])
      table
        .foreign("org_id")
        .references("id")
        .inTable("organizations")
        .onDelete("RESTRICT")
        .onUpdate("CASCADE")
    })
    await executeKnex(createTable)
  }
}

module.exports = { setupScraping }
