const { acquireTwitterAppFactory } = require("../../src/api/twitter")

test("Twitter API", async () => {
  const createTwitterApp = acquireTwitterAppFactory(true)
  const app = await createTwitterApp()
  const results = await app.post("users/lookup", {
    screen_name: "climatescape",
  })
  expect(results[0].followers_count).toEqual(expect.any(Number))
})
