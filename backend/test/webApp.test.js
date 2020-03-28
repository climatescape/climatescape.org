const supertest = require("supertest")

const { buildFastify } = require("../src/web")
const { pgPool } = require("../src/db/pg")
const { sleep } = require("../src/utils")
const { loadSampleOrgsIntoDb } = require("./prepareDb")

describe("web app", () => {
  let fastify
  let request
  beforeAll(async () => {
    fastify = await buildFastify()
    request = supertest(fastify.server)
    await pgPool.query("TRUNCATE TABLE scraping_results;")
  })
  afterAll(async () => fastify.close())
  afterAll(async () => pgPool.end())

  test("should reject request request without body", async () => {
    await request.post("/twitterUserObject").expect(400) // BAD REQUEST
  })

  test("happy path", async () => {
    await loadSampleOrgsIntoDb()

    await request
      .post("/twitterUserObject")
      .send({
        orgId: "rec01lt5ZeLGlwpg2",
        twitterScreenName: "altarock",
      })
      .expect(200)
    // The job should be picked up by the worker and an entry written into the database
    await sleep(2000)
    const results = await pgPool.query("SELECT * FROM scraping_results;")
    expect(results.rows.length).toBe(1)
    expect(results.rows[0].result.followers_count).toBe(100)
  })
})
