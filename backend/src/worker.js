const { setupPgBossQueue } = require("./db/pg")
const { setupScraping } = require("./db/setupScraping")
const {
  twitterUserObjectScrapingLoop,
  DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS,
} = require("./twitterUserObjectScraping")
const { isProduction } = require("./utils")

function setupTwitterUserObjectScraping(pgBossQueue) {
  // Don't throttle jobs during integration testing to arrive at the expected
  // results faster
  const twitterUserObjectsScrapingPeriodDelayMs = isProduction
    ? DELAY_BETWEEN_TWITTER_USERS_LOOKUP_API_CALLS_MS
    : 100
  setTimeout(async function doWork() {
    try {
      await twitterUserObjectScrapingLoop(pgBossQueue)
    } catch (err) {
      console.log("Error in Twitter user object scraping loop", err)
    }
    setTimeout(doWork, twitterUserObjectsScrapingPeriodDelayMs)
  }, twitterUserObjectsScrapingPeriodDelayMs)
}

async function startWorker() {
  const pgBossQueue = await setupPgBossQueue()
  await setupScraping()
  setupTwitterUserObjectScraping(pgBossQueue)
}

;(async () => {
  try {
    await startWorker()
  } catch (e) {
    console.error("Error starting worker", e)
  }
})()
