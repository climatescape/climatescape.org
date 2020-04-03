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
  const organizations = await table.select().firstPage()//all()
  const totalCount = organizations.length
  var foundCount = 0
  var updatedCount = 0
  var buffer = [] // Array of up to 10 updates to be sent as a batch to Airtable
  const updates = [] // Array of Promises returned from updates to Airtable

  // Procedure for clearing the buffer and recording the promise (used in two
  // places below)
  const clearBuffer = () => {
    return // TODO remove me!
    console.log("Clearing buffer", buffer)
    const promise = table.update(buffer).catch(console.error)
    updates.push(promise)
    buffer = []
  }

  console.log(`Trying to enrich ${totalCount} organizations`)

  await asyncForEach(organizations, async organization => {
    const fields = organization.fields
    const raw = await crunchbaseEnrich(camelizeKeys(fields))

    if (!raw) return

    foundCount++

    const mapped = mapCrunchbase(raw)
    const missing = missingFields(fields, mapped)

    if (missing) {
      updatedCount++

      buffer.push({
        id: organization.getId(),
        fields: missing,
      })
    }

    if (buffer.length === 10) clearBuffer()
  })

  // If we finished with a partial buffer, send one final update
  if (buffer.length) clearBuffer()

  console.log(`Waiting for ${updates.length} updates to finish`)

  // Updates have been happening asynchronously. Wait until all have resolved in
  // case any aren't finished yet (e.g. the final update)
  await Promise.all(updates)

  console.log(`Finished updating ${updatedCount} records of ${foundCount} found, ${totalCount} total`)
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

main();
