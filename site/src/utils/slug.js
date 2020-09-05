// Convert a string to a URL-friendly slug
module.exports.makeSlug = string => {
  return (
    string
      .toLowerCase()
      .trim()
      .replace("&", "and")
      .replace("-", "-minus")
      .replace("+", "-plus")
      // remove all non-alphanumeric chars and not-defined chars (+, -, etc)
      .replace(/[^\w\-+ ]/g, "")
      .replace(/ +/g, "-")
      // remove multiple consecutive '-'  ('---' -> '-')
      .replace(/(-)\1+/g, "-")
  )
}
