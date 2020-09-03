const TwitterRegexp = /twitter\.com\/@?(\w+)/i

export function parseTwitterHandle(url) {
  if (!url) return null

  let handle

  try {
    const [match] = url.match(TwitterRegexp)[1]
    handle = match
  } catch (e) {
    return null
  }

  return handle && `@${handle}`
}
