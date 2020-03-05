require("log-timestamp") // Adds timestamps to console.log() output

// Unlike NODE_ENV, this solution doesn't require any local setup moves from devs, nor setting any configs in Heroku.
// See https://stackoverflow.com/a/28489160
const isProduction = !!(process.env._ && process.env._.indexOf("heroku") >= 0)
console.log(`isProduction: ${isProduction}`)

async function sleep(timeMs) {
  await new Promise(resolve => setTimeout(resolve, timeMs))
}

module.exports = { isProduction, sleep }
