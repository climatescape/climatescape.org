const _ = require("lodash")
const Twitter = require("twitter-lite")
const pMemoize = require("p-memoize")
const { isProduction, configureEnvironment } = require("./utils")

/**
 * @returns {Promise<Twitter>}
 */
async function createTwitterApp() {
  configureEnvironment()
  const user = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
  })

  const response = await user.getBearerToken()
  return new Twitter({
    bearer_token: response.access_token,
  })
}

/**
 * @param {boolean} useRealTwitterApi
 * @returns {function(): Promise<Twitter>}
 */
function acquireTwitterAppFactory(useRealTwitterApi) {
  if (useRealTwitterApi) {
    return pMemoize(createTwitterApp)
  }
  return async () => {
    throw new Error("Don't real Twitter API in development")
  }
}

/**
 * @type {function(): Promise<Twitter>}
 */
const acquireTwitterApp = acquireTwitterAppFactory(isProduction)

/**
 * @param {Array<{data: {orgId: string, orgName: string, twitterScreenName: string}}>} jobs
 *        with data as returned from {@link createTwitterUserObjectScrapingJobData}
 * @returns {Promise<Array<{orgId: string, orgName: string, twitterUserObject: number}>>}
 */
async function scrapeTwitterUserObjects(jobs) {
  console.log(`Scraping Twitter user objects for: ${JSON.stringify(jobs)}`)
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
  const result = _.zipWith(jobs, response, (job, userObject) => ({
    ...job.data,
    twitterUserObject: userObject,
  }))
  console.log(`Scraped Twitter user objects: ${JSON.stringify(result)}`)
  return result
}

/**
 * @param {Object} org from Airtable
 * @returns {string}
 */
function getTwitterUrlString(org) {
  return org.fields["Twitter Override"] || org.fields.Twitter
}

/**
 * @param {Object} org from Airtable
 */
function orgToString(org) {
  return `${org.fields.Name} [${org.id}]`
}

/**
 * @param {Object} org from Airtable
 * @returns {string|null}
 */
function getTwitterScreenName(org) {
  const twitterUrlString = getTwitterUrlString(org)
  if (!twitterUrlString) {
    console.log(`No Twitter URL known for org ${orgToString(org)}`)
    return null
  }
  try {
    const url = new URL(twitterUrlString)
    return url.pathname
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
 * @param {Object} org from Airtable
 * @returns {{orgName: string, twitterUrl: string, orgId: string}}
 */
function createTwitterUserObjectScrapingJobData(org) {
  return {
    orgId: org.id,
    orgName: org.fields.Name,
    twitterScreenName: getTwitterScreenName(org),
  }
}

module.exports = {
  getTwitterScreenName,
  createTwitterUserObjectScrapingJobData,
  scrapeTwitterUserObjects,
  acquireTwitterAppFactory,
}
