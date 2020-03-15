exports.up = function createOrganizationsTable(knex) {
  return knex.schema.createTable("organizations", table => {
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
}

exports.down = function dropOrganizationsTable(knex) {
  return knex.schema.dropTable("organizations")
}
