const TwitterRegexp = /twitter\.com\/@?(\w+)/i

export function parseTwitterHandle(url) {
  if (!url) return null

  let handle

  try {
    handle = url.match(TwitterRegexp)[1]
  } catch (e) {
    return
  }

  return handle && `@${handle}`
}
