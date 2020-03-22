const fastify = require("fastify")({ logger: true })

const { executeInsertIfNotExists } = require("./db/pg")
const { setupPgBossQueue } = require("./db/pgBoss")
const { setupTables } = require("./db/setupTables")
const { TWITTER_USER_OBJECT } = require("./twitterUserObjectScraping")

async function buildFastify() {
  const pgBossQueue = await setupPgBossQueue()
  await setupTables()

  fastify.route({
    method: "POST",
    url: "/twitterUserObject",
    schema: {
      body: {
        type: "object",
        required: ["orgId", "twitterScreenName"],
        properties: {
          orgId: { type: "string" },
          orgName: { type: "string", nullable: true },
          twitterScreenName: { type: "string" },
        },
      },
    },
    async handler(req, res) {
      fastify.log.info(
        "Received request to scrape Twitter user object: ",
        req.body
      )
      await executeInsertIfNotExists(
        "organizations",
        {
          id: req.body.orgId,
        },
        {
          fields: {
            ...(req.body.orgName ? { Name: req.body.orgName } : {}),
            Twitter: `http://twitter.com/${req.body.twitterScreenName}`,
          },
        }
      )
      return await pgBossQueue.publish(TWITTER_USER_OBJECT, req.body)
    },
  })

  await fastify.listen(process.env.PORT || 3000, "0.0.0.0")
  fastify.log.info(`server listening on ${fastify.server.address().port}`)
  return fastify
}

if (require.main === module) {
  ;(async () => {
    try {
      await buildFastify()
    } catch (e) {
      console.error("Error starting fastify server", e)
    }
  })()
}

module.exports = { buildFastify }
