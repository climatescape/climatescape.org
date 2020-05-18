const TwitterRegexp = /twitter\.com\/@?(\w+)/i

export function parseTwitterHandle(url) {
  if (!url) return null

  const handle = url.match(TwitterRegexp)[1]

  return handle && `@${handle}`
}
