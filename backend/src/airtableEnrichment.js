const util = require("util")
const { knex, executeKnex } = require("./db/pg")
const { airtableBase } = require("./airtable")
const { TWITTER_USER_OBJECT } = require("./twitterUserObjectScraping")
const { computeRank } = require("./rank")

/**
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
  await pgBossQueue.publish(ENRICH_AIRTABLE, { orgId, orgName })
}

/**
 * @param {{orgId: string, orgName: string}} org
 * @returns {Promise<{Rank: number, "Enrichment Data": Object}>}
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
 *
 * @param {PgBoss} pgBossQueue
 * @param {Array<{id: string, data: {orgId: string, orgName: string},
 *                Rank: number, "Enrichment Data": Object}>} jobsWithEnrichmentFields
 */
async function updateAirtableOrganizations(
  pgBossQueue,
  jobsWithEnrichmentFields
) {
  const jobIds = jobsWithEnrichmentFields.map(job => job.id)
  const orgs = jobsWithEnrichmentFields.map(job => job.data)
  try {
    await airtableBase("organizations").update(
      jobsWithEnrichmentFields.map(job => ({
        id: job.data.orgId,
        fields: {
          Rank: job.Rank,
          "Enrichment Data": JSON.stringify(job["Enrichment Data"]),
        },
      }))
    )
    console.log(
      `Successfully enriched Airtable records for orgs: ${util.inspect(orgs)}`
    )
    await pgBossQueue.complete(jobIds)
  } catch (err) {
    console.error(
      `Error trying to update Airtable organizations ${util.inspect(orgs)}`,
      err
    )
    await pgBossQueue.fail(jobIds)
  }
}

/**
 * @param {PgBoss} pgBossQueue
 * @returns {Promise<void>}
 */
async function airtableEnrichmentLoop(pgBossQueue) {
  const pgBossJobs = await pgBossQueue.fetch(
    ENRICH_AIRTABLE,
    MAX_ORGS_PER_AIRTABLE_TABLE_UPDATE
  )
  if (!pgBossJobs) {
    return
  }
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
    await updateAirtableOrganizations(pgBossQueue, jobsWithEnrichmentData)
  }
}

module.exports = {
  addAirtableEnrichmentJob,
  prepareEnrichmentFields, // for tests
  airtableEnrichmentLoop,
}
