const axios = require("axios")

jest.mock("axios")

const {
  fetchCrunchbase,
  mapCrunchbase,
  crunchbaseEnrich,
  evaluateConfidence,
} = require("./crunchbase")

const CrunchbaseAirthiumByName = require("./mocks/name-airthium.json")
const CrunchbaseAirthiumByDomain = require("./mocks/domain-airthium.com.json")
const CrunchbaseArrivalByDomain = require("./mocks/domain-arrival.com.json")

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
    Name: "Airthium",
    UUID: "f21dbee02fb520b65b91da08a3abeebc",
    "Short Description":
      "Airthium makes low cost, zero emission, 30kW+ Thermodynamic energy storage systems, as well as high efficiency diesel generators",
    Logo: [
      {
        url:
          "http://public.crunchbase.com/t_api_images/v1503423190/hbk5jk03rluo7u9mwpig.png",
      },
    ],
    "Web Path": "organization/airthium",
    "Primary Role": "company",
    Domain: "airthium.com/",
    Homepage: "http://www.airthium.com/",
    Facebook: "https://www.facebook.com/aithium/",
    Twitter: "https://twitter.com/airthium",
    LinkedIn: "https://www.linkedin.com/company/airthium/",
    "Stock Exchange": null,
    "Stock Symbol": null,
    City: "Palaiseau",
    Region: "Ile-de-France",
    Country: "France",
  })
})

test("crunchbaseEnrich single positive result", async () => {
  axios.get.mockResolvedValue({ data: CrunchbaseAirthiumByName })

  const organization = { name: "Airthium", homepage: "https://airthium.com/" }
  const { result } = await crunchbaseEnrich(organization)

  expect(result).toEqual(
    expect.objectContaining({
      name: "Airthium",
    })
  )
})

test("crunchbaseEnrich multiple results disambiguated", async () => {
  axios.get.mockResolvedValue({ data: CrunchbaseArrivalByDomain })

  const organization = {
    name: "Arrival",
    homepage: "https://arrival.com/",
    twitter: "https://twitter.com/arrival",
    linkedIn: "https://www.linkedin.com/company/arrival-ltd/",
  }

  const { result } = await crunchbaseEnrich(organization)

  expect(result).toEqual(
    expect.objectContaining({
      name: "Arrival",
    })
  )
})

test.todo("crunchbaseEnrich single results name mismatch")
test.todo("crunchbaseEnrich name mismatch, domain match, no social")
test.todo("crunchbaseEnrich - no domain match, name search fallback")

test("evaluateConfidence crunchbase override", () => {
  const ours = {
    name: "Wont Match",
    crunchbase: "https://www.crunchbase.com/organization/will-match",
    twitter: "https://twitter.com/wontmatch",
    facebook: "https://facebook.com/wontmatch",
    linkedIn: "https://www.linkedin.com/company/wont-match",
  }

  const theirs = {
    name: "Cant Match",
    webPath: "organization/will-match",
    twitterUrl: "https://twitter.com/cantmatch",
    facebookUrl: "https://facebook.com/cantmatch",
    linkedinUrl: "https://www.linkedin.com/company/cant-match",
  }

  expect(evaluateConfidence(ours, theirs)).toBe(Infinity)
})

test("evaluateConfidence name only", () => {
  const ours = {
    name: "Will Match",
    crunchbase: "https://www.crunchbase.com/organization/wont-match",
    twitter: "https://twitter.com/wontmatch",
    facebook: "https://facebook.com/wontmatch",
    linkedIn: "https://www.linkedin.com/company/wont-match",
  }

  const theirs = {
    name: "Will Match",
    webPath: "organization/cant-match",
    twitterUrl: "https://twitter.com/cantmatch",
    facebookUrl: "https://facebook.com/cantmatch",
    linkedinUrl: "https://www.linkedin.com/company/cant-match",
  }

  expect(evaluateConfidence(ours, theirs)).toBe(10)
})

test("evaluateConfidence name mismatch, social match", () => {
  const ours = {
    name: "Wont Match",
    crunchbase: null,
    twitter: "https://twitter.com/willmatch",
    facebook: "https://facebook.com/willmatch",
    linkedIn: "https://www.linkedin.com/company/will-match",
  }

  const theirs = {
    name: "Cant Match",
    webPath: "organization/cant-match",
    twitterUrl: "https://twitter.com/willmatch",
    facebookUrl: "https://facebook.com/willmatch",
    linkedinUrl: "https://www.linkedin.com/company/will-match",
  }

  expect(evaluateConfidence(ours, theirs)).toBe(60)
})
