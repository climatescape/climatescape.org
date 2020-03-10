const Twitter = require("twitter-lite/twitter")
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
  // noinspection JSUnresolvedVariable
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
    // noinspection JSCheckFunctionSignatures: https://youtrack.jetbrains.com/issue/WEB-44307
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

module.exports = {
  acquireTwitterApp,
  acquireTwitterAppFactory,
  getTwitterScreenName,
}
