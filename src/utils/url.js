export function parseTwitterPath(url) {
  if (!url) return null
  if (url.startsWith("@")) return url
  const displayName = new URL(url).pathname.substring(1)
  return `@${displayName}`
}

export function buildUrl(url, network) {
  if (!url) return null
  try {
    const address = new URL(url)
    return address.href
  } catch (err) {
    if (url.startsWith("@")) {
      url = url.substring(1)
    }
    switch (network) {
      case "Twitter":
        return `https://twitter.com/${url}`
      default:
        return url
    }
  }
}
