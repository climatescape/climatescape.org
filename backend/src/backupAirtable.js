const { airtableBase, fetchAllRecords } = require("./airtable")

;(async () => {
  const allRecords = await fetchAllRecords(
    airtableBase("Organizations").select()
  )
  console.log(allRecords)
})()
