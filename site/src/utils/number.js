export const extractNumeric = str =>
  parseInt(
    str
      .replace("k", "000")
      .replace("M", "000000")
      .match(/\d+,?/gi)
      .pop(),
    10
  )
