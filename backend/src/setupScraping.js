const { pgPool } = require("./pg")

async function setupScraping() {
  await pgPool.query(
    "CREATE TABLE IF NOT EXISTS scraping_results (" +
      "  org_id text not null," +
      "  request_type text not null," +
      "  scraping_time timestamp DEFAULT current_timestamp," +
      "  result jsonb not null," +
      "  PRIMARY KEY(org_id, request_type, scraping_time)" +
      ");"
  )
  return pgPool
}

module.exports = setupScraping
