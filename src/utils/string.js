// Compare strings a & b for Array.sort() (ascending)
export const stringCompare = (a, b) => {
  a = a.toUpperCase()
  b = b.toUpperCase()

  return a < b ? -1 : a > b ? 1 : 0
}

export const stringShorten = str => {
  const toArr = str.split(" ")
  toArr.length = 5
  toArr[4] = toArr[4].replace(/[,.!]/, "")
  toArr.push("...")
  return toArr.join(" ")
}
