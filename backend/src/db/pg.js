// This file contains everything related to setup and direct usage of the Postgres database, except the pg-boss queue
// (which uses Postgres as the storage). pg-boss related logic is in pgBoss.js.

const Url = require("url")
const Pool = require("pg-pool")
const Knex = require("knex")

// WITHIN_CONTAINER is set in docker-compose.yml
// We are *not* running within a local container when we run jest tests, e. g. via `yarn test`
const isRunningWithinLocalContainer = process.env.WITHIN_CONTAINER === "true"
const host = isRunningWithinLocalContainer ? "db" : "localhost"
// user, password, and the database name correspond to those set in docker-compose.yml
const pgLocalConnectionString = `postgres://postgres:postgres@${host}:5432/postgres`

const { isProduction } = require("../utils")

const pgConnectionString = isProduction
  ? process.env.DATABASE_URL
  : pgLocalConnectionString

const params = Url.parse(pgConnectionString)
const auth = params.auth.split(":")

const pgConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split("/")[1],
  // If some problems with different SSL config for local dev and Heroku ever arise, they could be matched:
  // 1. Run the following commands (copied from https://gist.github.com/mrw34/c97bb03ea1054afb551886ffc8b63c3b):
  // openssl req -new -text -passout pass:abcd -subj /CN=localhost -out server.req -keyout privkey.pem
  // openssl rsa -in privkey.pem -passin pass:abcd -out server.key
  // openssl req -x509 -in server.req -text -key server.key -out server.crt
  // 2. Add the following lines to Dockerfile.postgres (copied from https://stackoverflow.com/a/55072885)
  // COPY server.key /var/lib/postgresql/server.key
  // COPY server.crt /var/lib/postgresql/server.crt
  //
  // RUN chmod 600 /var/lib/postgresql/server.key
  // RUN chown postgres:postgres /var/lib/postgresql/server.key
  // 3. Add to db service in docker-compose.yml:
  //     command:
  //       -c ssl=on -c ssl_cert_file=/var/lib/postgresql/server.crt -c ssl_key_file=/var/lib/postgresql/server.key
  ssl: isProduction
    ? {
        require: true,
        // See https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false,
      }
    : false,
}

const pgPool = new Pool(pgConfig)
pgPool.on("error", (err, client) => console.error(err))

// Should be removed when https://github.com/brianc/node-postgres/issues/1789 is fixed
const connectWrapper = async function() {
  /* eslint-disable no-await-in-loop */
  for (let nRetry = 1; ; nRetry += 1) {
    try {
      const client = await pgPool.connect()
      if (nRetry > 1) {
        console.info("Now successfully connected to Postgres")
      }
      return client
    } catch (e) {
      if (e.toString().includes("ECONNREFUSED") && nRetry < 5) {
        console.info(
          `${"ECONNREFUSED connecting to Postgres, " +
            "maybe container is not ready yet, will retry "}${nRetry}`
        )
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        throw e
      }
    }
  }
}
const pgPoolWrapper = {
  connect: connectWrapper,
  async query(text, values) {
    const client = await connectWrapper()
    try {
      return client.query(text, values)
    } finally {
      client.release()
    }
  },
}

/**
 * Don't provide connection to make knex(...) builders "cold" and only start
 * execution of the query in {@link executeKnex}.
 * @type {*|Knex<any, unknown[]>}
 */
const knex = Knex({
  client: "pg",
  debug: true,
  asyncStackTraces: !isProduction,
})

/**
 * @param {Knex.QueryBuilder|Knex.SchemaBuilder} knexQueryOrSchemaBuilder
 * @returns {Promise<*>}
 */
async function executeKnex(knexQueryOrSchemaBuilder) {
  const client = await connectWrapper()
  try {
    return await knexQueryOrSchemaBuilder.connection(client)
  } finally {
    client.release()
  }
}

/**
 * Knex Postgres INSERT or UPDATE
 * Adapted from https://github.com/knex/knex/issues/701#issuecomment-488075856
 * @param {string} table - table name
 * @param {Object} keys - constraint key/value object (insert)
 * @param {Object} payload - row data values (insert and/or update)
 * @returns {Promise<void>}
 */
async function executeInsertOrUpdate(table, keys, payload) {
  if (!Object.keys(payload).length) {
    throw new Error("Use executeInsertIfNotExists() instead")
  }
  const update = Object.keys(payload)
    .map(key => knex.raw("?? = EXCLUDED.??", [key, key]))
    .join(", ")

  const constraint = Object.keys(keys)
    .map(key => knex.ref(key))
    .join(", ")

  const sql = `? ON CONFLICT (${constraint}) DO UPDATE SET ${update};`
  const query = knex.raw(sql, [
    knex.insert({ ...keys, ...payload }).into(table),
  ])
  const result = await executeKnex(query)
  if ((update && result.rowCount === 0) || result.rowCount > 1) {
    throw new Error(
      `${result.rowCount} rows updated by the query, integrity constraint violation?`
    )
  }
}

/**
 * @param {string} table - table name
 * @param {Object} keys - constraint key/value object (insert)
 * @param {Object} payload - row data values
 * @returns {Promise<void>}
 */
async function executeInsertIfNotExists(table, keys, payload) {
  const constraint = Object.keys(keys)
    .map(key => knex.ref(key))
    .join(", ")

  const sql = `? ON CONFLICT (${constraint}) DO NOTHING;`
  const query = knex.raw(sql, [
    knex.insert({ ...keys, ...payload }).into(table),
  ])
  const result = await executeKnex(query)
  if (result.rowCount > 1) {
    throw new Error(
      `${result.rowCount} rows updated by the query, integrity constraint violation?`
    )
  }
}

/**
 * @param {string} table
 * @param {Array<Object>} data
 * @param {Array<string>} keyColumns
 * @param {Array<string>} valueColumns
 * @returns {Promise<number>} the number of rows updated
 */
async function executeBulkInsertOrUpdate(
  table,
  data,
  keyColumns,
  valueColumns
) {
  const update = valueColumns
    .map(key => knex.raw("?? = EXCLUDED.??", [key, key]))
    .join(", ")

  const constraint = keyColumns.map(key => knex.ref(key)).join(", ")

  const sql = `? ON CONFLICT (${constraint}) 
               DO ${(update && `UPDATE SET ${update}`) || "NOTHING"};`
  const query = knex.raw(sql, [knex.insert(data).into(table)]).debug(false)
  const result = await executeKnex(query)
  return result.rowCount
}

/**
 * @param {string} table
 * @returns {Promise<number>} the number of rows in the table
 */
async function executeCount(table) {
  const result = await executeKnex(
    knex(table)
      .count()
      .first()
  )
  return parseInt(result.count, 10)
}

module.exports = {
  pgConfig,
  pgPool: pgPoolWrapper,
  knex,
  executeKnex,
  executeCount,
  executeInsertOrUpdate,
  executeInsertIfNotExists,
  executeBulkInsertOrUpdate,
}
