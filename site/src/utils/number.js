export const extractNumeric = str =>
  parseInt(
    str
      .replace(/k/g, "000")
      .replace(/M/g, "000000")
      .match(/\d+,?/gi)
      .pop(),
    10
  )
