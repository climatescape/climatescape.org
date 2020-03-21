// Fetches the current organizations from the airtable base
// It creates an orgs.json file with the Org homepage and ID
const dot = require("dotenv")
const Airtable = require("airtable")
const Url = require("url")
const fs = require("fs")

dot.config({ path: `../../.env.development` })
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "app222HJxdrS6WwaY"
)

let orgs = []

base("Organizations")
  .select({ view: "Compact Grid" })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(record => {
        const hostUrl = record.get("Homepage")
        const host = Url.parse(hostUrl).hostname

        orgs.push({ hostUrl, id: record.id })
        // console.log(">", host, record.id)
      })

      fs.writeFileSync(
        "./out/pages.txt",
        orgs.map(org => org.hostUrl).join("\n")
      )
      fs.writeFileSync("./out/orgs.json", JSON.stringify(orgs, null, 2))
      fetchNextPage()
    },
    err => {
      if (err) {
        console.error(err)
      }
    }
  )
