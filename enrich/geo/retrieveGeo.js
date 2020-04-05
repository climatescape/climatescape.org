// Note: the node-open-geocoder library is a small library with a few downloads but is up-to-date
//  and working for now.
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
      .then((response) => {
        // console.log(response.geonames)
        resolve(response.geonames)
      })
      .catch((error) => {
        console.log(error)
        reject(err)
      })

    // openGeocoder()
    //   .geocode(hqLocation)
    //   .end((err, res) => {
    //     if (err) {
    //       console.error(err)
    //       reject(err)
    //       return
    //     }

    //     resolve(res)
    //   })
  })
}

async function retrieveGeoForOrg(org) {
  // e.g: "HQ Location": "Sausalito, California, USA"
  const hqLocation = org.fields["HQ Location"]
  if (!hqLocation) {
    return null
  }

  const data = await retrieveGeoForHqLocation(hqLocation)
  if (!isArray(data)) {
    return null
  }
  return isEmpty(data) ? null : data[0]
}

module.exports = { retrieveGeoForOrg }
