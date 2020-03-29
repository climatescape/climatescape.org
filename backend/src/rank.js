/**
 * The so-called "Climatescape Rank" is the weight of the organization according to which we want to focus the attention
 * of the site editors (by sorting Airtable tables according to this Rank as one of the enrichment columns (see
 * airtableEnrichment.js) and users: see https://github.com/climatescape/climatescape.org/issues/174.
 * @param twitterUserObject {{followers_count: number} | *} Twitter user object
 * @returns {number}
 */
function computeRank(twitterUserObject) {
  // Currently, the implementation is trivial - just return the number of Twitter followers. But when more factors will
  // be considered and different factors can be absent in different organizations, the formula should be more
  // sophisticated to be effective.
  return twitterUserObject.followers_count
}

module.exports = { computeRank }
