const Airtable = require("airtable")
const dotenv = require("dotenv")
const isProduction = require("./isProduction")

if (!isProduction) {
  dotenv.config({
    path: `../.env.development`,
  })
}

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
})
const airtableBase = Airtable.base("appNYMWxGF1jMaf5V")

module.exports = airtableBase

airtableBase("Organizations")
  .select({ view: "Compact Grid" })
  .firstPage(function(err, records) {
    if (err) {
      console.error(err)
      return
    }
    records.forEach(function(record) {
      console.log("Retrieved", record)
    })
  })
