// Filter duplicated and empty items from an array
export const filterDuplicateAndEmptyItems = (...items) =>
  [...new Set(items)].filter(m => m)
