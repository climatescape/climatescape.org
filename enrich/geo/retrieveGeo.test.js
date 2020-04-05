const { retrieveGeoForOrg } = require("./retrieveGeo")
const { computeGeo } = require("./computeGeo")

// npm run jest src/geo/retrieveGeo.test.js

describe("retrieveGeoForOrg", () => {
  test("happy path", async () => {
    const data = await retrieveGeoForOrg({
      fields: {
        "HQ Location": "Sausalito, California, USA",
      },
    })

    const computedGeoData = computeGeo(data)

    console.log(data)
    console.log(computedGeoData)

    expect(computedGeoData).toEqual({
      Country: "United States of America",
      State: "California",
      City: "Sausalito",
    })
  })
})
