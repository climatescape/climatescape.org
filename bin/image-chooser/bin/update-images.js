// Uploads the photos to airtable
// Reads the images from images.json and uses the Org IDs from orgs.json

const dot = require("dotenv")
const Airtable = require("airtable")
const Url = require("url")
const fs = require("fs")

dot.config({ path: `../../.env.development` })
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "app222HJxdrS6WwaY"
)

let orgs = require("./out/orgs.json")
let images = require("./out/images.json")

let updates = []

for (const org of orgs) {
  const orgImages = images.filter(image => image.hostUrl == org.hostUrl)
  updates.push({
    id: org.id,
    fields: {
      Photos: orgImages.map(image => ({
        filename: image.filename,
        url: image.url,
      })),
    },
  })
}

;(async function() {
  let count = 1
  while (count * 10 <= updates.length) {
    console.log(count)
    try {
      await base("Organizations").update(
        updates.slice(count * 10, (count + 1) * 10)
      )
    } catch (e) {
      console.error(`failed ${count}`, e.message)
    }
    count++
  }
})()
