const { setupPgBossQueue } = require("./pg")
const {
  addFirstTimeTwitterUserObjectScrapingJobs,
} = require("./twitterUserObjectScraping")

async function addFirstTimeScrapingJobs() {
  const pgBossQueue = await setupPgBossQueue()
  await addFirstTimeTwitterUserObjectScrapingJobs(pgBossQueue)
}

if (require.main === module) {
  ;(async () => {
    try {
      await addFirstTimeScrapingJobs()
    } catch (e) {
      console.error("Error adding first-time scraping jobs", e)
    }
  })()
}

module.exports = { addFirstTimeScrapingJobs }
