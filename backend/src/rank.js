function computeRank(twitterUserObject) {
  return twitterUserObject.followers_count;
}

module.exports = { computeRank }