// Compare strings a & b for Array.sort() (ascending)
export const stringCompare = (a, b) => {
  a = a.toUpperCase()
  b = b.toUpperCase()

  return a < b ? -1 : a > b ? 1 : 0
}
