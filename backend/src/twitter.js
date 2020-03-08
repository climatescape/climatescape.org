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
  const app = new Twitter({
    bearer_token: response.access_token,
  })
  return app
}

/**
 * @param {boolean} useRealTwitterApi
 * @returns {((...arguments: unknown[]) => Promise<unknown>)|*|(function(): *)}
 */
function createTwitterAppFactory(useRealTwitterApi = isProduction) {
  if (useRealTwitterApi) {
    return pMemoize(createTwitterApp)
  }
  return async () => {
    throw new Error("Don't real Twitter API in development")
  }
}

/**
 * @param {Object} data
 * @returns {Promise<number>}
 */
async function twitterFollowers(data) {
  if (isProduction) {
    throw new Error("not implemented yet")
  } else {
    return 100
  }
}

/**
 * @param {Object} org from Airtable
 * @returns {string}
 */
function getTwitterUrl(org) {
  return org.fields["Twitter Override"] || org.fields.Twitter
}

/**
 * @param {Object} org from Airtable
 * @returns {{orgName: string, twitterUrl: string, orgId: string}}
 */
function createTwitterFollowersJobData(org) {
  return {
    orgId: org.id,
    orgName: org.fields.Name,
    twitterUrl: getTwitterUrl(org),
  }
}

/**
 * @param {{twitterUrl: string, orgId: string}} data job data as returned from
 *        {@link createTwitterFollowersJobData}
 * @returns {Promise<number>}
 */
async function scrapeTwitterFollowers(data) {
  console.log(`Scraping Twitter followers: ${JSON.stringify(data)}`)
  const numTwitterFollowers = await twitterFollowers(data)
  console.log(`Twitter followers of ${data.orgId}: ${numTwitterFollowers}`)
  return numTwitterFollowers
}

module.exports = {
  getTwitterUrl,
  createTwitterFollowersJobData,
  scrapeTwitterFollowers,
  createTwitterAppFactory,
}
