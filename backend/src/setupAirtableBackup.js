const { knex, executeKnex } = require("./pg")

async function setupAirtableBackup() {
  const tableExists = await executeKnex(knex.schema.hasTable("organizations"))
  if (!tableExists) {
    const createTable = knex.schema.createTable("organizations", table => {
      table
        .string("id")
        .notNullable()
        .primary()
      table.jsonb("fields").notNullable()
      table.timestamps(false, true) // Adds created_at, updated_at columns
      table
        .dateTime("deleted_at")
        .nullable()
        .defaultTo(null)
    })
    await executeKnex(createTable)
  }
}

module.exports = { setupAirtableBackup }
