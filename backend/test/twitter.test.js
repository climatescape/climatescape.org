const {
  acquireTwitterAppFactory,
  getCleanPath,
  getTwitterScreenName,
} = require("../src/twitter")

test("getCleanPath", () => {
  expect(getCleanPath("https://twitter.com/climatescape")).toBe("climatescape")
  // Test ending slash is cleansed
  expect(getCleanPath("https://twitter.com/climatescape/")).toBe("climatescape")
})

test("getTwitterScreenName", () => {
  const org = {
    id: "climatescape",
    fields: { Twitter: "https://twitter.com/climatescape" },
  }
  expect(getTwitterScreenName(org)).toBe("climatescape")
  org.fields["Twitter Override"] = "https://twitter.com/climatescape1/"
  expect(getTwitterScreenName(org)).toBe("climatescape1")
})

test("Twitter API", async () => {
  const createTwitterApp = acquireTwitterAppFactory(true)
  const app = await createTwitterApp()
  const results = await app.post("users/lookup", {
    screen_name: "climatescape",
  })
  expect(results[0].followers_count).toEqual(expect.any(Number))
})
