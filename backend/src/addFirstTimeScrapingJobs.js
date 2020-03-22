const { setupPgBossQueue } = require("./db/pgBoss")
const {
  addFirstTimeTwitterUserObjectScrapingJobs,
} = require("./twitterUserObjectScraping")
const { fetchAndBackupAllAirtableOrganizations } = require("./airtableBackup")

async function addFirstTimeScrapingJobs() {
  const pgBossQueue = await setupPgBossQueue()
  await addFirstTimeTwitterUserObjectScrapingJobs(pgBossQueue)
  await pgBossQueue.stop()
}

if (require.main === module) {
  ;(async () => {
    try {
      await fetchAndBackupAllAirtableOrganizations()
    } catch (err) {
      console.error("Error backing up Airtable organizations", err)
    }
    try {
      await addFirstTimeScrapingJobs()
    } catch (err) {
      console.error("Error adding first-time scraping jobs", err)
    }
  })()
  // It's unknown why the process doesn't exit itself, maybe because of pgPool
  process.exit(0)
}

module.exports = { addFirstTimeScrapingJobs }
