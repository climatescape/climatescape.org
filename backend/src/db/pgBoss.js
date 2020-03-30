// This file contains everything related to setup and use of pg-boss queue, which is used to fuel background task
// processing (see decision 3-background-task-processing.md). See
// https://github.com/timgit/pg-boss/blob/master/docs/usage.md for instructions about how to use pg-boss. See
// 4-use-pg-boss-queue.md for discussion of the decision to use pg-boss.

const util = require("util")
const PgBoss = require("pg-boss")
const pMemoize = require("p-memoize")
const { executeWithFixedDelayAsync } = require("../utils")
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
  deleteIntervalHours: 1, // Delete archived jobs after 1 hour
  maintenanceIntervalMinutes: 1,
})

pgBossQueue.on("error", err => console.error(err))

// Periodically removes the unneeded jobs that otherwise pile up uncontrollably.
// See https://github.com/timgit/pg-boss/issues/159
executeWithFixedDelayAsync(
  async function deletePgBossMaintenanceCompletedJobs() {
    await pgBossQueue.deleteQueue("__state__completed____pgboss__maintenance")
  },
  60 * 1000 // once a minute
)

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
