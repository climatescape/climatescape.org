const puppeteer = require("puppeteer")
const Url = require("url")
const fs = require("fs")

let count = 0
const results = []

const urls = require("../out/orgs").map(org => org.hostUrl)

async function getImages(browser, orgUrl) {
  console.log("> ", orgUrl, ++count)

  try {
    let num = 1
    const host = Url.parse(orgUrl).hostname
    const page = await browser.newPage()
    const client = await page.target().createCDPSession()
    await client.send("Network.enable")
    client.on(
      "Network.responseReceived",
      async ({ type, response: { mimeType, url } }) => {
        try {
          if (type === "Image") {
            if (mimeType === "image/jpeg" || mimeType === "image/png") {
              const ext = mimeType === "image/jpeg" ? "jpeg" : "png"
              const filename = `${host}-${num++}.${ext}`
              // eslint-disable-next-line no-console
              results.push({
                filename,
                url,
                orgUrl,
              })
            }
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    )
    await page.goto(orgUrl)
    await page.close()
    fs.writeFileSync("./out/results.json", JSON.stringify(results, null, 2))

    // eslint-disable-next-line no-empty
  } catch (e) {}
}

async function fetchImages() {
  const browser = await puppeteer.launch()

  for (const url of urls) {
    // eslint-disable-next-line no-await-in-loop
    await getImages(browser, url)
  }

  fs.writeFileSync("./results.json", JSON.stringify(results, null, 2))
  await browser.close()
}

if (true) {
  fetchImages()
}
