const axios = require("axios")

const { getDomain, camelizeKeys } = require("./utils")

const API_KEY = process.env.CRUNCHBASE_API_KEY
const ODM_ORGS_URL = "https://api.crunchbase.com/v3.1/odm-organizations"

// Accepts an organization and returns an enriched version of that organization
// as well as a raw Crunchbase enrichment object.
// TODO: We will want to fall back to search by Name at some point
// TODO: We will want to handle multiple results at some point
async function crunchbaseEnrich({ name, homepage, crunchbase, twitter, linkedin }) {
  const domain = getDomain(homepage)
  const results = await fetchCrunchbase({ domain })

  if (results.length == 0) {
    console.log(`crunchbaseEnrich: no results for Organization '${name}' domain: ${domain}`)
  } else if (results.length > 1) {
    console.log(`crunchbaseEnrich: multiple results for Organization '${name}' domain: ${domain}`, results)
  } else {
    const result = results[0]

    // TODO: We can implement a more robust confidence check here, using other
    // attributes like social media profiles to determine if we have the correct
    // result. Name frequently doesn't match due to minor inconsistencies in the
    // spelling or formatting
    if (result.name === name) {
      return result
    } else {
      console.log(`crunchbaseEnrich: name mismatch for Organization '${name}' got ${result.name}`)
    }
  }
}

// Accepts an OrganizationSummary from Crunchbase and returns a populated
// Airtable Organization object
function mapCrunchbase({
  webPath, primaryRole, shortDescription, profileImageUrl,
  facebookUrl, twitterUrl, linkedinUrl, cityName, regionName, countryCode,
}) {
  let role

  if (primaryRole === "investor") role = "Capital"

  return {
    "Tagline Override": shortDescription,
    Logo: profileImageUrl && [{ url: profileImageUrl }],
    "Crunchbase URL Override": `https://crunchbase.com/${webPath}`,
    Role: role,
    Facebook: facebookUrl,
    "Twitter Override": twitterUrl,
    "LinkedIn Override": linkedinUrl,
    "HQ Location Override": [cityName, regionName, countryCode].filter(x => x).join(", "),
  }
}

// Accepts the `domain` OR `name` of an organization and queries the Crunchbase
// ODM API. Return an array of results formatted in camelCase
async function fetchCrunchbase({ domain, name }) {
  if (!name && !domain) throw new Error('must pass either domain OR name')
  if (name && domain) throw new Error('must pass domain OR name, not both')

  let query

  if (name) query = { name }
  else query = { domain_name: domain }

  const response = await axios.get(ODM_ORGS_URL, {
    params: {
      user_key: API_KEY,
      ...query
    }
  })

  // Map directly to the items in the response, unwrap and camelize `properties`
  return response.data.data.items.map(({ type, uuid, properties }) => ({
    type, uuid, ...camelizeKeys(properties)
  }))
}

module.exports = {
  crunchbaseEnrich,
  fetchCrunchbase,
  mapCrunchbase
}
