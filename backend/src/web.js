const buildFastify = require("./app")

;(async () => {
  try {
    await buildFastify()
  } catch (e) {
    console.error("Error starting fastify server", e)
  }
})()
