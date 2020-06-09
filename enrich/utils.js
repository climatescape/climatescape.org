const { camelCase, toPairs, fromPairs } = require("lodash")

// Given an `object`, return a new object converted to camelCase
function camelizeKeys(object) {
  return fromPairs(toPairs(object).map(([k, v]) => [camelCase(k), v]))
}

// Given a URL, return just the domain. Strip the subdomain if it equals "www"
function getUrlDomain(string) {
  try {
    const { hostname } = new URL(string)

    return hostname.startsWith("www.") ? hostname.substr(4) : hostname
  } catch {
    return null
  }
}

// Given a URL, return just the path, without leading or trailing slashes,
// converted to lowercase
function getSocialPath(string) {
  try {
    const { pathname } = new URL(string)

    if (!pathname || pathname.length <= 1) return null

    return pathname.replace(/^\/|\/$/g, "").toLowerCase()
  } catch {
    return null
  }
}

module.exports = { camelizeKeys, getUrlDomain, getSocialPath }
