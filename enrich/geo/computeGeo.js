const get = require("lodash/get")

const AirtableGeoField = {
  COUNTRY: "Country",
  STATE: "State",
  CITY: "City",
  LONGITUDE: "Longitude",
  LATITUDE: "Latitude",
}

/**
 * Transform geo data from openstreetmap to the airtable data model.
 */
function computeGeo(geoData) {
  if (!geoData) {
    // TODO: or return empty object data?
    return null
  }

  return {
    [AirtableGeoField.COUNTRY]: get(geoData, "countryName"),
    [AirtableGeoField.STATE]: get(geoData, "adminName1"),
    [AirtableGeoField.CITY]: get(geoData, "toponymName"),
    [AirtableGeoField.LONGITUDE]: get(geoData, "lng"),
    [AirtableGeoField.LATITUDE]: get(geoData, "lat"),
  }
}

module.exports = { computeGeo }
