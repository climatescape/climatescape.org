const { setupPgBossQueue } = require("./db/pg")
const {
  addFirstTimeTwitterUserObjectScrapingJobs,
} = require("./twitterUserObjectScraping")
const { fetchAndBackupAllAirtableOrganizations } = require("./airtableBackup")

async function addFirstTimeScrapingJobs() {
  const pgBossQueue = await setupPgBossQueue()
  await addFirstTimeTwitterUserObjectScrapingJobs(pgBossQueue)
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
}

module.exports = { addFirstTimeScrapingJobs }
