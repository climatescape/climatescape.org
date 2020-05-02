const { makeSlug } = require("./slug.js")

describe(`makeSlug()`, () => {
  it(`should handle simple slugs`, () => {
    expect(makeSlug("test")).toEqual("test")
  })

  it(`should handle spaces`, () => {
    expect(makeSlug(" test with     spaces   ")).toEqual("test-with-spaces")
  })

  it(`should handle numerics`, () => {
    expect(makeSlug("123")).toEqual("123")
    expect(makeSlug("123 test")).toEqual("123-test")
    expect(makeSlug("test 123")).toEqual("test-123")
  })

  // to handle Planet+ org
  // see https://github.com/climatescape/climatescape.org/issues/272
  it(`should handle '+'`, () => {
    expect(makeSlug("test+")).toEqual("test-plus")
    expect(makeSlug("Terra Food + AG Tech Accelerator")).toEqual(
      "terra-food-plus-ag-tech-accelerator"
    )
  })

  it(`should handle '-'`, () => {
    expect(makeSlug("test-")).toEqual("test-minus")
  })

  it(`should remove consecutive '-'`, () => {
    expect(makeSlug("test -")).toEqual("test-minus")
  })
})
