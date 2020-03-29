// This file contains everything for dealing directly with the Twitter API.

const Twitter = require("twitter-lite/twitter")
const pMemoize = require("p-memoize")
const { isProduction, configureEnvironment } = require("../utils")

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

module.exports = {
  acquireTwitterApp,
  acquireTwitterAppFactory,
}
