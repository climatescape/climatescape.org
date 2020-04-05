const dot = require("dotenv")
const path = require("path")
const isEmpty = require("lodash/isEmpty")
const Airtable = require("airtable")

dot.config({
  path: path.resolve(path.join(__dirname, "/../../.env.development")),
})

const { retrieveGeoForOrg } = require("./retrieveGeo")
const { computeGeo } = require("./computeGeo")

async function asyncForEach(array, callback) {
  const promises = []
  for (let index = 0; index < array.length; index += 1) {
    promises.push(callback(array[index], index, array))
  }
  return Promise.all(promises)
}

function getFieldsGeoData(fields) {
  return [
    fields.Country,
    fields.State,
    fields.City,
    fields.Longitude,
    fields.Latitude,
  ]
}

async function main() {
  if (!process.env.AIRTABLE_API_KEY) {
    console.log("Missing AIRTABLE_API_KEY env property")
    return
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  )

  // const table = base("Organizations")
  const table = base("Organizations")
  table
    .select({
      pageSize: 10,
      view: "Geo",
    })
    .eachPage(async (organizations, fetchNextPage) => {
      console.log(`Fetched ${organizations.length} organizations`)

      const updatedOrganizations = await asyncForEach(
        organizations,
        async organization => {
          try {
            // do nothing if we already have the data.
            // - avoid too much geo pt API calls
            // - avoid overriding data that could have been changed manually

            if (getFieldsGeoData(organization.fields).every(isEmpty)) {
              // console.log(organization.fields)
              return null
            }

            const geoData = await retrieveGeoForOrg(organization)

            const data = computeGeo(geoData)

            organization.fields = {
              ...organization.fields,
              ...data,
            }
          } catch (e) {
            console.log("geo error:")
            console.error(e)
          }

          // console.log(updatedOrg)
          return organization
        }
      )

      const updatedOrganizationsData = updatedOrganizations
        // filter null values, org that we do not want to update
        .filter(Boolean)
        .map(orgData => {
          return {
            id: orgData.id,
            fields: {
              Country: orgData.fields.Country,
              State: orgData.fields.State,
              City: orgData.fields.City,
              Latitude: orgData.fields.Latitude,
              Longitude: orgData.fields.Longitude,
            },
          }
        })
        // filter org for which we didn't found a location (all fields are empty)
        .filter(orgData => !getFieldsGeoData(orgData.fields).some(isEmpty))

      if (!isEmpty(updatedOrganizationsData)) {
        try {
          await table.update(updatedOrganizationsData)
          console.log(
            `updated ${updatedOrganizationsData.length} organizations`
          )
        } catch (e) {
          console.log("Update error:")
          console.error(e)
        }
      }

      fetchNextPage()
    })
    .catch(e => {
      console.error(e)
    })
}

try {
  main()
} catch (e) {
  console.error(e)
}
