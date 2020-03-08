const { createTwitterAppFactory } = require("../src/twitter")

test("Twitter API", async () => {
  const createTwitterApp = createTwitterAppFactory(true)
  const app = await createTwitterApp()
  const results = await app.post("users/lookup", {
    screen_name: "climatescape",
  })
  expect(results[0].followers_count).toEqual(expect.any(Number))
})
