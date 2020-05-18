const { getCleanPath } = require("../src/utils")

test("getCleanPath", () => {
  expect(getCleanPath("https://twitter.com/climatescape")).toBe("climatescape")
  // Test ending slash is cleansed
  expect(getCleanPath("https://twitter.com/climatescape/")).toBe("climatescape")
})
