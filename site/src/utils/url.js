const TwitterRegexp = /twitter\.com\/@?(\w+)/i

export function parseTwitterHandle(url) {
  if (!url) return null

  try {
    const [handle] = url.match(TwitterRegexp)[1]
    return handle && `@${handle}`
  } catch (e) {
    return null
  }
}
