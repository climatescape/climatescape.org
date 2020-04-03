const axios = require("axios")

const { getUrlDomain, getSocialPath, camelizeKeys } = require("./utils")

const API_KEY = process.env.CRUNCHBASE_API_KEY
const ODM_ORGS_URL = "https://api.crunchbase.com/v3.1/odm-organizations"
const SITES = ["twitter", "facebook", "linkedin", "homepage"]

// Accepts the `domain` OR `name` of an organization and queries the Crunchbase
// ODM API. Return an array of results formatted in camelCase
async function fetchCrunchbase({ domain, name }) {
  if (!name && !domain) throw new Error("must pass either domain OR name")
  if (name && domain) throw new Error("must pass domain OR name, not both")

  let query

  if (name) query = { name }
  else query = { domain_name: domain }

  const response = await axios.get(ODM_ORGS_URL, {
    params: {
      user_key: API_KEY,
      ...query,
    },
  })

  // Map directly to the items in the response, unwrap and camelize `properties`
  return response.data.data.items.map(({ type, uuid, properties }) => ({
    type,
    uuid,
    ...camelizeKeys(properties),
  }))
}

// Given an Airtable organization `ours` and a Crunchbase organization `theirs`,
// return a confidence score between 0 and Infinity, inclusive, where a higher
// number indicates higher confidence that the two organizations match
function evaluateConfidence(ours, theirs) {
  let score = 0

  const us = {
    name: ours.name.toLowerCase(),
    homepage: getUrlDomain(ours.homepage),
    crunchbase: getSocialPath(ours.crunchbase),
    twitter: getSocialPath(ours.twitter),
    linkedin: getSocialPath(ours.linkedIn),
    facebook: getSocialPath(ours.facebook),
  }

  const them = {
    name: theirs.name.toLowerCase(),
    homepage: getUrlDomain(theirs.homepageUrl),
    crunchbase: theirs.webPath.toLowerCase(),
    twitter: getSocialPath(theirs.twitterUrl),
    linkedin: getSocialPath(theirs.linkedinUrl),
    facebook: getSocialPath(theirs.facebookUrl),
  }

  // A match on the Crunchbase URL is an automatic perfect score
  if (us.crunchbase === them.crunchbase) return Infinity

  // A match on the name (case-insensitive) is a pretty good indication
  if (us.name === them.name) score += 10

  // A match to any websites is a really good indication
  SITES.forEach(website => {
    if (us[website] && us[website] === them[website]) score += 20
  })

  return score
}

// Accepts an organization and returns an enriched version of that organization
// as well as a raw Crunchbase enrichment object. If the organization could not
// be enriched, returns a reason (~err) as the first value
async function crunchbaseEnrich(organization, options = { method: "domain" }) {
  const { name, homepage } = organization
  const { method } = options

  const results = await fetchCrunchbase(
    method === "domain" ? { domain: getUrlDomain(homepage) } : { name }
  )

  if (!results.length) {
    // If we can't match the domain, try falling back to a name search
    if (method === "domain") {
      return await crunchbaseEnrich(organization, { method: "name" })
    } else {
      return {
        msg: `no-results`,
        context: { organization, options },
      }
    }
  }

  // Score each of the results and select the highest scoring
  const scored = results.map(
    org => ({ _score: evaluateConfidence(organization, org), ...org })
  )
  const maxScore = scored.reduce((max, org) => Math.max(max, org._score), 0)

  // A score of 0 means we couldn't match anything
  if (maxScore === 0) {
    return {
      msg: `no-matches`,
      context: { organization, options, scored },
    }
  }

  const top = scored.filter(org => org._score === maxScore)

  if (top.length > 1) {
    return {
      msg: `multiple-matches`,
      context: { organization, options, scored },
    }
  } else {
    return {
      msg: `success-${method}`,
      result: top[0],
      context: { organization, options, scored },
    }
  }
}

// Accepts an OrganizationSummary from Crunchbase and returns a populated
// Airtable Organization object
function mapCrunchbase({
  webPath,
  primaryRole,
  shortDescription,
  profileImageUrl,
  facebookUrl,
  twitterUrl,
  linkedinUrl,
  cityName,
  regionName,
  countryCode,
}) {
  let role

  if (primaryRole === "investor") role = "Capital"

  return {
    "Tagline Override": shortDescription,
    Logo: profileImageUrl && [{ url: profileImageUrl }],
    Crunchbase: `https://crunchbase.com/${webPath}`,
    Role: role,
    Facebook: facebookUrl,
    "Twitter Override": twitterUrl,
    "LinkedIn Override": linkedinUrl,
    "HQ Location Override": [cityName, regionName, countryCode]
      .filter(x => x)
      .join(", "),
  }
}

module.exports = {
  crunchbaseEnrich,
  fetchCrunchbase,
  mapCrunchbase,
  evaluateConfidence,
}
