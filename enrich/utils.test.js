const { getUrlDomain, getSocialPath } = require("./utils")

test("getUrlDomain", () => {
  expect(getUrlDomain("https://www.airthium.com/")).toBe("airthium.com")
  expect(getUrlDomain("http://www.airthium.com/")).toBe("airthium.com")
  expect(getUrlDomain("http://airthium.com/")).toBe("airthium.com")
  expect(getUrlDomain("https://airthium.com/")).toBe("airthium.com")
  expect(getUrlDomain("http://airthium.com")).toBe("airthium.com")
  expect(getUrlDomain("https://airthium.com")).toBe("airthium.com")
  expect(getUrlDomain("https://www.woodlandtrust.org.uk/")).toBe(
    "woodlandtrust.org.uk"
  )
  expect(getUrlDomain("https://woodlandtrust.org.uk/")).toBe(
    "woodlandtrust.org.uk"
  )
  expect(getUrlDomain("https://airthium.com/test?1=123")).toBe("airthium.com")
  expect(getUrlDomain("lacking-a-protocol.com")).toBe(null)
  expect(getUrlDomain("not a domain")).toBe(null)
})

test("getSocialPath", () => {
  expect(
    getSocialPath("https://www.crunchbase.com/organization/acciona-energy")
  ).toBe("organization/acciona-energy")
  expect(getSocialPath("https://www.crunchbase.com/")).toBe(null)
  expect(getSocialPath("https://www.crunchbase.com")).toBe(null)
  expect(getSocialPath("https://twitter.com/SomeDope_Handle")).toBe(
    "somedope_handle"
  )
  expect(getSocialPath("https://www.linkedin.com/company/centrica/")).toBe(
    "company/centrica"
  )
  expect(getSocialPath(null)).toBe(null)
  expect(getSocialPath(undefined)).toBe(null)
})
