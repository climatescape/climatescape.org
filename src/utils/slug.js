// Convert a string to a URL-friendly slug
module.exports.makeSlug = string => {
  return string
    .toLowerCase()
    .replace("&", "and")
    .replace(/[^\w\- ]/g, "")
    .replace(/ +/g, "-")
}
