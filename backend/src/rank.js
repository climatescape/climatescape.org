/**
 * @param twitterUserObject {{followers_count: number} | *} Twitter user object
 * @returns {number}
 */
function computeRank(twitterUserObject) {
  return twitterUserObject.followers_count
}

module.exports = { computeRank }
