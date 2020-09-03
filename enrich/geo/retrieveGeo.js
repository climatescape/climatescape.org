// Note: the node-open-geocoder library is a small library with a few downloads
// but is up-to-date and working for now.
const GeocoderGeonames = require("geocoder-geonames")

const isEmpty = require("lodash/isEmpty")
const isArray = require("lodash/isArray")

async function retrieveGeoForHqLocation(hqLocation) {
  return new Promise((resolve, reject) => {
    const geocoder = new GeocoderGeonames({
      username: "climatescape",
    })

    geocoder
      .get("search", {
        q: hqLocation,
      })
      .then(response => {
        // Errors look like { value: Number, message: String }
        if (response.value) reject(response.message)

        // Successful responses look like { geonames: Array }
        else resolve(response.geonames)
      })
      .catch(reject)
  })
}

async function retrieveGeoForOrg(hqLocation) {
  // e.g: "HQ Location": "Sausalito, California, USA"
  if (!hqLocation) {
    return null
  }

  const data = await retrieveGeoForHqLocation(hqLocation)
  if (!isArray(data)) {
    throw new Error("Unexpected response")
  }
  return isEmpty(data) ? null : data[0]
}

module.exports = { retrieveGeoForOrg }
