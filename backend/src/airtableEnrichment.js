// This file includes logic related to background enrichment of Airtable with the scraped and computed data (currently -
// Rank, see rank.js). See decision 6-push-data-to-airtable.md for more discussion. This logic is called from the
// background worker - see worker.js.

const util = require("util")
const { isProduction } = require("./utils")
const { knex, executeKnex } = require("./db/pg")
const { airtableBase } = require("./api/airtable")
const { TWITTER_USER_OBJECT } = require("./twitterUserObjectScraping")
const { computeRank } = require("./rank")

/**
 * Used as the name of pg-boss jobs for Airtable enrichment.
 * @type {string}
 */
const ENRICH_AIRTABLE = "enrichAirtable"

/**
 * @param {PgBoss} pgBossQueue
 * @param {string} orgId
 * @param {string} orgName
 * @returns {Promise<void>}
 */
async function addAirtableEnrichmentJob(pgBossQueue, orgId, orgName) {
  await pgBossQueue.publishOnce(
    ENRICH_AIRTABLE,
    { orgId, orgName },
    {
      retryLimit: 3,
      // 15 min, in seconds. addAirtableEnrichmentJob() gets executed in the worker process, and Airtable is not an
      // urgent tasks, therefore we have a relatively lax retry delay. Not more than 15 min because dynos in Heroku are
      // restarted at least once a day, so with longer period more jobs attempted close to the restart time won't have
      // a change to retry all 3 times.
      retryDelay: 15 * 60,
    },
    orgId
  )
}

/**
 * @param {{orgId: string, orgName: string}} org
 * @returns {Promise<{Rank: number, 'Enrichment Data': Object}>}
 */
async function prepareEnrichmentFields(org) {
  const query = knex("scraping_results")
    .select("result")
    .where({
      org_id: org.orgId,
      request_type: TWITTER_USER_OBJECT,
    })
    .orderBy("updated_at", "desc")
    .limit(1)
    .first()
  const result = await executeKnex(query)
  if (!result) {
    throw new Error(`No scraping results for ${util.inspect(org)}`)
  }
  const twitterUserObject = result.result
  if (!("followers_count" in twitterUserObject)) {
    throw new Error(
      `Not a valid Twitter user object: ${util.inspect(twitterUserObject)}`
    )
  }
  const rank = computeRank(twitterUserObject)
  console.log(`Climatescape rank for ${util.inspect(org)}: ${rank}`)
  return {
    Rank: rank,
    "Enrichment Data": { twitterUserObject },
  }
}

/**
 * This limit is documented here:
 * https://airtable.com/appNYMWxGF1jMaf5V/api/docs#javascript/table:organizations:update
 * @type {number}
 */
const MAX_ORGS_PER_AIRTABLE_TABLE_UPDATE = 10

/**
 * @param {Array<{id: string, data: {orgId: string, orgName: string},
 *                Rank: number, 'Enrichment Data': Object}>} jobsWithEnrichmentData
 * @return {Promise<void>}
 */
async function updateAirtableOrgs(jobsWithEnrichmentData) {
  const airtableTable = isProduction
    ? "organizations"
    : "Organizations - Integration Testing Clone"
  await airtableBase(airtableTable).update(
    jobsWithEnrichmentData.map(job => ({
      id: job.data.orgId,
      fields: {
        Rank: job.Rank,
        "Enrichment Data": JSON.stringify(job["Enrichment Data"]),
      },
    }))
  )
  const orgs = jobsWithEnrichmentData.map(job => job.data)
  console.log(
    `Successfully enriched Airtable records for orgs: ${util.inspect(orgs)}`
  )
}

/**
 * @param {PgBoss} pgBossQueue
 * @returns {Promise<void>}
 */
async function processAirtableEnrichmentJobs(pgBossQueue) {
  const pgBossJobs = await pgBossQueue.fetch(
    ENRICH_AIRTABLE,
    MAX_ORGS_PER_AIRTABLE_TABLE_UPDATE
  )
  if (!pgBossJobs) {
    return
  }
  /**
   * @type {Array<{id: string, data: {orgId: string, orgName: string}, Rank: number, 'Enrichment Data': Object}>}
   */
  const jobsWithEnrichmentData = []
  await Promise.all(
    pgBossJobs.map(async job => {
      const org = job.data
      try {
        const enrichmentFields = await prepareEnrichmentFields(org)
        jobsWithEnrichmentData.push({ ...job, ...enrichmentFields })
      } catch (err) {
        console.error(
          `Error preparing enrichment data for ${JSON.stringify(org)}`,
          err
        )
        await pgBossQueue.fail(job.id, err)
      }
    })
  )
  if (jobsWithEnrichmentData.length) {
    const jobIds = jobsWithEnrichmentData.map(job => job.id)
    try {
      await updateAirtableOrgs(jobsWithEnrichmentData)
      await pgBossQueue.complete(jobIds)
    } catch (err) {
      const orgs = jobsWithEnrichmentData.map(job => job.data)
      console.error(
        `Error trying to update Airtable organizations ${util.inspect(orgs)}`,
        err
      )
      await pgBossQueue.fail(jobIds)
    }
  }
}

module.exports = {
  addAirtableEnrichmentJob,
  prepareEnrichmentFields, // for tests
  processAirtableEnrichmentJobs,
}
