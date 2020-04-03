const axios = require("axios")

jest.mock("axios")

const {
  fetchCrunchbase,
  mapCrunchbase,
  crunchbaseEnrich,
} = require("../src/crunchbase")

const CrunchbaseAirthiumByName = require("./mocks/crunchbase/name-airthium.json")
const CrunchbaseAirthiumByDomain = require("./mocks/crunchbase/domain-airthium.com.json")

const AirthiumOrganizationSummary = {
  type: "OrganizationSummary",
  uuid: "f21dbee02fb520b65b91da08a3abeebc",
  permalink: "airthium",
  apiPath: "organizations/airthium",
  webPath: "organization/airthium",
  apiUrl: "https://api.crunchbase.com/v3.1/organizations/airthium",
  name: "Airthium",
  stockExchange: null,
  stockSymbol: null,
  primaryRole: "company",
  shortDescription:
    "Airthium makes low cost, zero emission, 30kW+ Thermodynamic energy storage systems, as well as high efficiency diesel generators",
  profileImageUrl:
    "http://public.crunchbase.com/t_api_images/v1503423190/hbk5jk03rluo7u9mwpig.png",
  domain: "airthium.com/",
  homepageUrl: "http://www.airthium.com/",
  facebookUrl: "https://www.facebook.com/aithium/",
  twitterUrl: "https://twitter.com/airthium",
  linkedinUrl: "https://www.linkedin.com/company/airthium/",
  cityName: "Palaiseau",
  regionName: "Ile-de-France",
  countryCode: "France",
  createdAt: 1503423197,
  updatedAt: 1539755818,
}

test("fetchCrunchbase by name", async () => {
  axios.get.mockResolvedValue({ data: CrunchbaseAirthiumByName })

  const results = await fetchCrunchbase({ name: "Airthium " })

  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Airthium", primaryRole: "company" }),
    ])
  )
})

test("fetchCrunchbase by domain", async () => {
  axios.get.mockResolvedValue({ data: CrunchbaseAirthiumByDomain })

  const results = await fetchCrunchbase({ domain: "airthium.com " })

  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Airthium", primaryRole: "company" }),
    ])
  )
})

test("mapCrunchbase", () => {
  expect(mapCrunchbase(AirthiumOrganizationSummary)).toEqual({
    "Tagline Override":
      "Airthium makes low cost, zero emission, 30kW+ Thermodynamic energy storage systems, as well as high efficiency diesel generators",
    Logo: [
      {
        url:
          "http://public.crunchbase.com/t_api_images/v1503423190/hbk5jk03rluo7u9mwpig.png",
      },
    ],
    Role: undefined,
    "Crunchbase URL Override": "https://crunchbase.com/organization/airthium",
    "Twitter Override": "https://twitter.com/airthium",
    "LinkedIn Override": "https://www.linkedin.com/company/airthium/",
    Facebook: "https://www.facebook.com/aithium/",
    "HQ Location Override": "Palaiseau, Ile-de-France, France",
  })
})

test("crunchbaseEnrich single positive result", async () => {
  axios.get.mockResolvedValue({ data: CrunchbaseAirthiumByName })

  const organization = { name: "Airthium", homepage: "https://airthium.com/" }
  const result = await crunchbaseEnrich(organization)

  expect(result).toEqual(
    expect.objectContaining({
      name: "Airthium",
    })
  )
})
