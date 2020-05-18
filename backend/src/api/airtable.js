// This file contains everything for dealing directly with Airtable API.

const Airtable = require("airtable")
const { configureEnvironment, sleep } = require("../utils")

configureEnvironment()
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
})
const airtableBase = Airtable.base(process.env.AIRTABLE_BASE_ID)

/**
 * The rate limit is 5 rps, but we don't try to be even close to that because several different parallel operations
 * with Airtable API may happen in the backend system, e. g. fetching records from tables and writing enrichment data.
 * Additionally, there may be integration testing running in parallel, using the same Airtable API key.
 * @type {number}
 */
const DELAY_BETWEEN_AIRTABLE_API_CALLS_MS = 1000

/**
 * This function is adapted from airtable.js: https://github.com/Airtable/airtable.js/blob/
 * 31fd0a089fee87832760f35c7270eae283972e35/lib/query.js#L116-L135 to include waits to avoid hitting Airtable's rate
 * limits accidentally (see https://github.com/Airtable/airtable.js/issues/30), and add more logging.
 * @returns {Promise<Array<Object>>}
 */
function fetchAllRecords(airtableQuery) {
  return new Promise((resolve, reject) => {
    const allRecords = []
    airtableQuery.eachPage(
      function page(pageRecords, fetchNextPage) {
        allRecords.push(...pageRecords)
        console.log(
          `Fetched ${pageRecords.length} records, now ${allRecords.length} in total`
        )
        sleep(DELAY_BETWEEN_AIRTABLE_API_CALLS_MS)
          .then(() => fetchNextPage())
          .catch(error => reject(error))
      },
      function error(err) {
        if (err) {
          reject(err)
        } else {
          console.log(`Fetched ${allRecords.length} records in total`)
          resolve(allRecords)
        }
      }
    )
  })
}

/**
 * @returns {Promise<Array<Object>>} array of orgs from Airtable
 */
async function fetchAllOrgsFromAirtable() {
  console.log("Fetching organizations from Airtable...")
  const allOrgRecords = await fetchAllRecords(
    airtableBase("Organizations").select()
  )
  // Cleans up irrelevant fields: references to the parent table, callback
  // functions, etc.
  return allOrgRecords.map(orgRecord => {
    return { id: orgRecord.id, fields: orgRecord.fields }
  })
}

module.exports = {
  airtableBase,
  DELAY_BETWEEN_AIRTABLE_API_CALLS_MS,
  fetchAllOrgsFromAirtable,
}
