// This file includes logic related to background scraping of Twitter user objects (see
// https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/user-object). It is called from the background
// worker - see worker.js.

const _ = require("lodash")
const { acquireTwitterApp } = require("./api/twitter")
const { isProduction, getCleanPath } = require("./utils")
const { executeInsertOrUpdate } = require("./db/pg")

/**
 * Used as both the name of pg-boss jobs for Twitter use object scraping and the value for the request_type column in
 * the scraping_results table in Postgres.
 * @type {string}
 */
const TWITTER_USER_OBJECT = "twitterUserObject"

/**
 * @param {Array<{data: {orgId: string, orgName: string, twitterScreenName: string}}>} jobs
 *        with data as returned from {@link createTwitterUserObjectScrapingJobData}
 * @returns {Promise<Array<{orgId: string, orgName: string, twitterUserObject: Object}>>}
 */
async function scrapeTwitterUserObjects(jobs) {
  console.log(
    `Scraping Twitter user objects for ${jobs.length} orgs: ${JSON.stringify(
      jobs
    )}`
  )
  if (!isProduction) {
    return jobs.map(job => ({
      ...job.data,
      twitterUserObject: { followers_count: 100 },
    }))
  }
  const screenNames = jobs.map(job => job.data.twitterScreenName).join(",")
  const app = await acquireTwitterApp()
  const response = await app.post("users/lookup", {
    screen_name: screenNames,
  })
  // TODO match orgs with twitter screen name ids - blindly relying on Twitter returning the same number of objects
  //  in the same order as asked is unreliable
  const result = _.zipWith(jobs, response, (job, userObject) => ({
    ...job.data,
    twitterUserObject: userObject,
  }))
  console.log(`Scraped Twitter user objects: ${JSON.stringify(result)}`)
  return result
}

/**
 * @param {{id: string, fields: Object}} org from Airtable
 * @returns {string}
 */
function getTwitterUrlString(org) {
  // noinspection JSUnresolvedVariable
  return org.fields["Twitter Override"] || org.fields.Twitter
}

/**
 * @param {{id: string, fields: Object}} org from Airtable
 */
function orgToString(org) {
  return `${org.fields.Name} [${org.id}]`
}

/**
 * @param {{id: string, fields: Object}} org from Airtable
 * @returns {string|null}
 */
function getTwitterScreenName(org) {
  const twitterUrlString = getTwitterUrlString(org)
  if (!twitterUrlString) {
    console.log(`No Twitter URL known for org ${orgToString(org)}`)
    return null
  }
  try {
    return getCleanPath(twitterUrlString)
  } catch (err) {
    console.log(
      `Twitter URL for org ${orgToString(
        org
      )} is not valid: ${twitterUrlString}`,
      err
    )
    return null
  }
}

/**
 * @param {{id: string, fields: Object}} org from Airtable
 * @returns {{orgId: string, orgName: string, twitterScreenName: string, orgId}}
 */
function createTwitterUserObjectScrapingJobData(org) {
  return {
    orgId: org.id,
    orgName: org.fields.Name,
    twitterScreenName: getTwitterScreenName(org),
  }
}

/**
 * @param {PgBoss} pgBossQueue
 * @param {{id: string, fields: Object}} org from Airtable
 */
async function publishTwitterUserObjectScrapingJob(pgBossQueue, org) {
  return await pgBossQueue.publishOnce(
    TWITTER_USER_OBJECT,
    createTwitterUserObjectScrapingJobData(org),
    {
      retryLimit: 3,
      // 15 min, in seconds. 15 min is the size of the rate limiting window, as documented at
      // https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
      retryDelay: 15 * 60,
    },
    org.id
  )
}

/**
 * @param {PgBoss} pgBossQueue
 * @param {function(orgId: string, orgName: string): Promise<any>} handler
 * @returns {Promise<void>}
 */
async function onSuccessfulTwitterUserObjectScraping(pgBossQueue, handler) {
  await pgBossQueue.onComplete(TWITTER_USER_OBJECT, async completionJob => {
    try {
      const scrapingJob = completionJob.data
      // As created in createTwitterUserObjectScrapingJobData()
      const orgData = scrapingJob.request.data
      if (!scrapingJob.failed) {
        await handler(orgData.orgId, orgData.orgName)
      }
      // It's strange that pgBoss requires this call, see https://github.com/timgit/pg-boss/issues/151
      await pgBossQueue.complete(completionJob.id)
    } catch (err) {
      console.error(
        "Error in Twitter user object scraping job completion handler",
        err
      )
      // It's unknown if such explicit completionJob failing is required, but since complete() is required (see above),
      // explicit fail() might be required, too.
      await pgBossQueue.fail(completionJob.id, err)
    }
  })
}

/**
 * @param {PgBoss} pgBossQueue
 * @param {Array<{id: string, fields: Object}>} orgsToScrape - array of orgs from Airtable
 * @returns {Promise<void>}
 */
async function addTwitterUserObjectScrapingJobs(pgBossQueue, orgsToScrape) {
  const orgsWithTwitter = orgsToScrape.filter(getTwitterScreenName)
  await Promise.all(
    orgsWithTwitter.map(org =>
      publishTwitterUserObjectScrapingJob(pgBossQueue, org)
    )
  )
}

/**
 * @param {{orgId: string, orgName: string, twitterUserObject: Object}} orgData
 * @returns {Promise<void>}
 */
async function storeTwitterUserObject(orgData) {
  const now = new Date()
  await executeInsertOrUpdate(
    "scraping_results",
    {
      org_id: orgData.orgId,
      request_type: TWITTER_USER_OBJECT,
      created_at: now,
    },
    {
      updated_at: now,
      result: orgData.twitterUserObject,
    }
  )
  console.log(
    `Twitter user object for ${JSON.stringify(
      orgData
    )} was successfully stored in the database`
  )
}

/**
 * This limit is documented here:
 * https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
 * @type {number}
 */
const MAX_ACCOUNTS_PER_TWITTER_USERS_LOOKUP_API_CALL = 100

/**
 * https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
 * documents 300 requests / 15 min window = 1 request / 3 seconds as the limit for app auth. We issue requests more than
 * three times less frequently than that, 1 request / 10 seconds, just in case, to avoid hitting the limits accidentally
 * (e. g. when doing integration testing in parallel with production operation using the same app credentials).
 * @type {number}
 */
const DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS = 10000

/**
 * @param {PgBoss} pgBossQueue
 * @returns {Promise<void>}
 */
async function processTwitterUserObjectScrapingJobs(pgBossQueue) {
  const pgBossJobs = await pgBossQueue.fetch(
    TWITTER_USER_OBJECT,
    MAX_ACCOUNTS_PER_TWITTER_USERS_LOOKUP_API_CALL
  )
  if (!pgBossJobs) {
    return
  }
  let orgsWithTwitterUserObjects
  try {
    orgsWithTwitterUserObjects = await scrapeTwitterUserObjects(pgBossJobs)
  } catch (err) {
    console.error(
      `Error scraping Twitter user objects for ${JSON.stringify(pgBossJobs)}`,
      err
    )
    await pgBossQueue.fail(pgBossJobs.map(job => job.id))
    return
  }
  await Promise.all(
    orgsWithTwitterUserObjects.map(async (orgData, i) => {
      try {
        await storeTwitterUserObject(orgData)
        await pgBossQueue.complete(pgBossJobs[i].id)
      } catch (err) {
        console.error(
          `Error while storing Twitter user object for ${JSON.stringify(
            orgData
          )} in the database`,
          err
        )
        await pgBossQueue.fail(pgBossJobs[i].id, err)
      }
    })
  )
}

module.exports = {
  TWITTER_USER_OBJECT,
  addTwitterUserObjectScrapingJobs,
  onSuccessfulTwitterUserObjectScraping,
  processTwitterUserObjectScrapingJobs,
  DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS,
  getTwitterScreenName, // for testing
}
