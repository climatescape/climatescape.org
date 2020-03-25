const pMemoize = require("p-memoize")
const Knex = require("knex")
const knexConfig = require("./knexfile")

/**
 * @returns {Promise<void>}
 */
async function setupTables() {
  const knex = Knex(knexConfig)
  await knex.migrate.latest()
}

module.exports = { setupTables: pMemoize(setupTables) }
