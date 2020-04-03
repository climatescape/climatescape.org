const { getCleanPath, getUrlDomain } = require("../src/utils")

test("getCleanPath", () => {
  expect(getCleanPath("https://twitter.com/climatescape")).toBe("climatescape")
  // Test ending slash is cleansed
  expect(getCleanPath("https://twitter.com/climatescape/")).toBe("climatescape")
})

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
