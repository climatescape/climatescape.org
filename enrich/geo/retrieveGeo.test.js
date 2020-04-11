const { retrieveGeoForOrg } = require("./retrieveGeo")
const { computeGeo } = require("./computeGeo")

// npm test

describe("retrieveGeoForOrg", () => {
  test("happy path", async () => {
    const data = await retrieveGeoForOrg("Sausalito, California, USA")
    const computedGeoData = computeGeo(data)

    expect(computedGeoData).toEqual({
      "HQ Country": "United States",
      "HQ Region": "California",
      "HQ Locality": "Sausalito",
      "HQ Latitude": "-122.48525",
      "HQ Longitude": "37.85909",
    })
  })
})
