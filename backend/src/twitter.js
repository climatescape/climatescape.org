const { isProduction } = require("./utils")

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
  getTwitter: getTwitterUrl,
  createTwitterFollowersJobData,
  scrapeTwitterFollowers,
}
