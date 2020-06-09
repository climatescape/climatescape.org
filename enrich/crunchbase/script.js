const dot = require("dotenv")
const path = require("path")
const Airtable = require("airtable")

dot.config({
  path: path.resolve(path.join(__dirname, "../../.env.development")),
})

const { crunchbaseEnrich, mapCrunchbase } = require("./crunchbase")
const { camelizeKeys } = require("../utils")

const BASE = process.env.AIRTABLE_BASE_ID
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(BASE)

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array) // eslint-disable-line no-await-in-loop
  }
}

async function main() {
  const organizations = await base("Organizations")
    .select()
    .all()
  const outcomes = {}
  const updateBuffer = [] // Array of up to 10 updates to be sent as a batch to Airtable
  const createBuffer = [] // Array of up to 10 creates to be sent as a batch to Airtable
  const destroyBuffer = [] // Array of up to 10 destroys to be sent as a batch to Airtable
  const updates = [] // Array of Promises returned from updates to Airtable

  // Procedure for clearing a buffer and recording the promise
  const flushBuffer = (buffer, op) => {
    console.dir(buffer, { depth: null }) // Log entire buffer
    const promise = base("Crunchbase ODM")
      [op](buffer)
      .catch(console.error)
    updates.push(promise)
    buffer.length = 0
  }

  console.log(`Trying to enrich ${organizations.length} organizations`)

  await asyncForEach(organizations, async organization => {
    const fields = camelizeKeys(organization.fields)
    const recId = fields.crunchbaseOdm && fields.crunchbaseOdm[0]
    let outcome

    try {
      outcome = await crunchbaseEnrich(fields)
    } catch (err) {
      return console.error(
        `Error enriching name="${fields.name}" homepage="${fields.homepage}"`,
        err
      )
    }

    outcomes[outcome.msg] = (outcomes[outcome.msg] || 0) + 1

    // Couldn't find a match, log the result for debugging
    if (!outcome.result) {
      console.dir(outcome, { depth: null })

      // If we already have a record in Airtable, destroy it. This ensures that
      // improvements (to our algorithm or Crunchbase's dataset) to our
      // false positive rate can be recorded
      if (recId) {
        destroyBuffer.push(recId)
        if (destroyBuffer.length === 10) flushBuffer(destroyBuffer, "destroy")
      }
    } else {
      const mapped = mapCrunchbase(outcome.result)

      // If we already have a record in Airtable, update it, otherwise create one
      if (recId) {
        updateBuffer.push({ id: recId, fields: mapped })
        if (updateBuffer.length === 10) flushBuffer(updateBuffer, "update")
      } else {
        createBuffer.push({
          fields: {
            Organization: [organization.getId()],
            ...mapped,
          },
        })
        if (createBuffer.length === 10) flushBuffer(createBuffer, "create")
      }
    }

    return null
  })

  // If we finished with any partial buffers, flush them now
  if (updateBuffer.length) flushBuffer(updateBuffer, "update")
  if (createBuffer.length) flushBuffer(createBuffer, "create")
  if (destroyBuffer.length) flushBuffer(destroyBuffer, "destroy")

  // Updates have been happening asynchronously. Wait until all have resolved in
  // case any aren't finished yet (e.g. the final update)
  console.log(`Waiting for ${updates.length} Airtable API calls to finish`)
  await Promise.all(updates)

  // Log final stats
  console.log(`Outcomes: `, outcomes)
}

;(async () => {
  try {
    await main()
  } catch (err) {
    console.error("main() failed with exception", err)
  }
})()
