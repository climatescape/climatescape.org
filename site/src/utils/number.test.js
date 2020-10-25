const { extractNumeric } = require("./number.js")

describe(`extractNumeric()`, () => {
  it(`should properly parse all formats`, () => {
    expect(extractNumeric("1")).toEqual(1)
    expect(extractNumeric("1-10")).toEqual(10)
    expect(extractNumeric("$1M")).toEqual(1000000)
    expect(extractNumeric("$10M-50M")).toEqual(50000000)
  })
})
