const { knex, executeKnex } = require("./db/pg")
const { setupScraping } = require("./db/setupScraping")

/**
 * @param {string} requestType request type, e. g. "twitterUserObject"
 * @returns {Promise<Array<{id: string, fields: Object}>>} array of Airtable org
 * objects
 */
async function determineOrgsToScrapeFirstTime(requestType) {
  await setupScraping()
  const lastResultsByRequestTypeQuery = knex("scraping_results")
    .select("org_id", "result as last_result")
    .distinctOn("org_id")
    .where({ request_type: requestType })
    .orderBy(["org_id", { column: "updated_at", order: "desc" }])
    .as("last_results")
  const orgsToScrapeQuery = knex("organizations")
    .select("id", "fields")
    .leftOuterJoin(
      lastResultsByRequestTypeQuery,
      "organizations.id",
      "last_results.org_id"
    )
    .whereNull("last_result")
  return await executeKnex(orgsToScrapeQuery)
}

module.exports = {
  determineOrgsToScrapeFirstTime,
}
