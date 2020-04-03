const dot = require("dotenv")
const Airtable = require("airtable")

dot.config({ path: `../../.env.development` })

const { crunchbaseEnrich, mapCrunchbase } = require("../../backend/src/crunchbase")
const { camelizeKeys } = require("../../backend/src/utils")

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appAix36fGcTDsrLq"// prod: "appNYMWxGF1jMaf5V"
)

const table = base("Organizations")

async function main() {
  const organizations = await table.select().all()
  const totalCount = organizations.length
  var foundCount = 0
  var updatedCount = 0
  const outcomes = {}
  var buffer = [] // Array of up to 10 updates to be sent as a batch to Airtable
  const updates = [] // Array of Promises returned from updates to Airtable

  // Procedure for clearing the buffer and recording the promise (used in two
  // places below)
  const flushBuffer = () => {
    console.dir(buffer, { depth: null })
    updates.push(table.update(buffer).catch(console.error))
    buffer = []
  }

  console.log(`Trying to enrich ${totalCount} organizations`)

  await asyncForEach(organizations, async organization => {
    const fields = organization.fields
    let outcome

    try {
      outcome = await crunchbaseEnrich(camelizeKeys(fields))
    } catch (err) {
      return console.error(
        `Error enriching name="${fields.name}" homepage="${fields.homepage}"`,
        err
      )
    }

    outcomes[outcome.msg] = (outcomes[outcome.msg] || 0) + 1

    if (!outcome.result) return console.dir(outcome, { depth: null })

    foundCount++

    const mapped = mapCrunchbase(outcome.result)
    const missing = missingFields(fields, mapped)

    if (missing) {
      updatedCount++

      buffer.push({
        id: organization.getId(),
        fields: missing,
      })
    }

    if (buffer.length === 10) flushBuffer()
  })

  // If we finished with a partial buffer, send one final update
  if (buffer.length) flushBuffer()

  console.log(`Waiting for ${updates.length} updates to finish`)

  // Updates have been happening asynchronously. Wait until all have resolved in
  // case any aren't finished yet (e.g. the final update)
  await Promise.all(updates)

  console.log(`Finished: updated=${updatedCount} matched=${foundCount} total=${totalCount}`)
  console.log(`Outcomes: `, outcomes)
}

// Return a subset of source with only the fields present in source and missing
// from dest. If no fields are missing, the return value is `null`
function missingFields(dest, source) {
  const missing = Object.keys(source).reduce((accum, key) => {
    if (!dest[key] && source[key]) accum[key] = source[key]

    return accum
  }, {})

  return Object.keys(missing).length ? missing : null
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(async () => {
  try {
    await main();
  } catch (err) {
    console.error("main() failed with exception", err)
  }
})();
