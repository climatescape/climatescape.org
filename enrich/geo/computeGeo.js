const get = require("lodash/get")

const AirtableGeoField = {
  COUNTRY: "HQ Country",
  STATE: "HQ Region",
  CITY: "HQ Locality",
  LONGITUDE: "HQ Latitude",
  LATITUDE: "HQ Longitude",
}

/**
 * Transform geo data from openstreetmap to the airtable data model.
 */
function computeGeo(geoData) {
  // Return empty fields if passed a falsey value (useful for resetting)
  if (!geoData) geoData = {}

  return {
    [AirtableGeoField.COUNTRY]: get(geoData, "countryName", null),
    [AirtableGeoField.STATE]: get(geoData, "adminName1", null),
    [AirtableGeoField.CITY]: get(geoData, "toponymName", null),
    [AirtableGeoField.LONGITUDE]: get(geoData, "lng", null),
    [AirtableGeoField.LATITUDE]: get(geoData, "lat", null),
  }
}

module.exports = { computeGeo }
