const dot = require("dotenv")
const path = require("path")
const Airtable = require("airtable")

dot.config({
  path: path.resolve(path.join(__dirname, "../../.env.development")),
})

const { retrieveGeoForOrg } = require("./retrieveGeo")
const { computeGeo } = require("./computeGeo")

async function main() {
  if (!process.env.AIRTABLE_API_KEY) {
    console.log("Missing AIRTABLE_API_KEY env property")
    return
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  )

  const table = base("Organizations")

  table
    .select({ pageSize: 10 })
    .eachPage(async (organizations, fetchNextPage) => {
      console.log(`Fetched ${organizations.length} organizations`)

      const updates = await Promise.all(
        organizations.map(async organization => {
          let fields

          try {
            const hqLocation = organization.fields["HQ Location"]
            const geoData = await retrieveGeoForOrg(hqLocation)

            fields = computeGeo(geoData)
          } catch (e) {
            console.error("geo error:", e)
          } finally {
            // If geo failed, we want to empty any old values
            if (!fields) fields = computeGeo()
          }

          // console.log(updatedOrg)
          return {
            id: organization.id,
            fields,
          }
        })
      )

      try {
        await table.update(updates)
        console.log(`updated ${updates.length} organizations`)
      } catch (e) {
        console.log("Update error:")
        console.error(e)
      }

      fetchNextPage()
    })
    .catch(e => {
      console.error(e)
    })
}

;(async () => {
  try {
    await main()
  } catch (err) {
    console.error("main() failed with exception", err)
  }
})()
