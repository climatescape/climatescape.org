const Airtable = require("airtable")
const { configureEnvironment, sleep } = require("./utils")

configureEnvironment()
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
})
const airtableBase = Airtable.base("appNYMWxGF1jMaf5V")

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
        // The rate limit is 5 rps, but we don't try to be even close to that because there may be concurrent operations
        // with Airtable API happening in the backend system, e. g. writing scraped data to Airtable.
        sleep(1000)
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

module.exports = { airtableBase, fetchAllRecords }
