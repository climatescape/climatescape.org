exports.up = function createScrapingResultsTable(knex) {
  return knex.schema.createTable("scraping_results", table => {
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
}

exports.down = function dropScrapingResultsTable(knex) {
  return knex.schema.dropTable("scraping_results")
}
