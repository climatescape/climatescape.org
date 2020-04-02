const { getCleanPath, getDomain } = require("../src/utils")

test("getCleanPath", () => {
  expect(getCleanPath("https://twitter.com/climatescape")).toBe("climatescape")
  // Test ending slash is cleansed
  expect(getCleanPath("https://twitter.com/climatescape/")).toBe("climatescape")
})

test("getDomain", () => {
  expect(getDomain("https://www.airthium.com/")).toBe("airthium.com")
  expect(getDomain("http://www.airthium.com/")).toBe("airthium.com")
  expect(getDomain("http://airthium.com/")).toBe("airthium.com")
  expect(getDomain("https://airthium.com/")).toBe("airthium.com")
  expect(getDomain("http://airthium.com")).toBe("airthium.com")
  expect(getDomain("https://airthium.com")).toBe("airthium.com")
  expect(getDomain("https://www.woodlandtrust.org.uk/")).toBe("woodlandtrust.org.uk")
  expect(getDomain("https://woodlandtrust.org.uk/")).toBe("woodlandtrust.org.uk")
  expect(getDomain("https://airthium.com/test?1=123")).toBe("airthium.com")
  expect(getDomain("lacking-a-protocol.com")).toBe(null)
  expect(getDomain("not a domain")).toBe(null)
})
