const util = require("util")
const PgBoss = require("pg-boss")
const pMemoize = require("p-memoize")
const { pgPool } = require("./pg")

const pgBossQueue = new PgBoss({
  db: {
    executeSql: async (text, values) => {
      try {
        return await pgPool.query(text, values)
      } catch (err) {
        console.error(
          `pg-boss query failed: ${text}
          values: ${util.inspect(values)}`,
          err
        )
        throw err
      }
    },
  },
})

pgBossQueue.on("error", err => console.error(err))

/**
 * @returns {Promise<PgBoss>}
 */
async function setupPgBossQueue() {
  await pgBossQueue.start()
  return pgBossQueue
}

// noinspection JSCheckFunctionSignatures: https://youtrack.jetbrains.com/issue/WEB-44307
/**
 * @type {function(): Promise<PgBoss>}
 */
const setupPgBossQueueMemoized = pMemoize(setupPgBossQueue)

module.exports = {
  setupPgBossQueue: setupPgBossQueueMemoized,
}
