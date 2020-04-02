const dot = require("dotenv")
const Airtable = require("airtable")

dot.config({ path: `../../.env.development` })

const { crunchbaseEnrich, mapCrunchbase } = require("../../backend/src/crunchbase")
const { camelizeKeys } = require("../../backend/src/utils")

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appNYMWxGF1jMaf5V"
)

const table = base("Organizations")

async function main() {
  const organizations = await table.select().firstPage()//all()
  var updatesQueue = []

  console.log(`Fetched ${organizations.length} organizations`)

  await asyncForEach(organizations, async organization => {
    const fields = camelizeKeys(organization.fields)
    const raw = await crunchbaseEnrich(fields)

    if (!raw) return

    const mapped = mapCrunchbase(raw)

    // TODO: Add updates to the updatesQueue. Every time the queue hits 10
    // records, we can send a single API request to Airtable to update all 10
    // at once
    
    // console.log(mapped, raw)
    // process.exit()
  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

main();
