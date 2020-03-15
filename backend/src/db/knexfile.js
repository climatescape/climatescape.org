const path = require("path")
const { pgConfig } = require("./pg")

module.exports = {
  client: "pg",
  connection: pgConfig,
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
    tableName: "knex_migrations",
  },
}
