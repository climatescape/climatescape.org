const { formatHeadcounts } = require("./OrganizationFilter.js")

const Headcounts = [
  { headcount: "1-10" },
  { headcount: "11-50" },
  { headcount: "" },
  { headcount: undefined },
  { headcount: null },
  { headcount: "1-10" },
  { headcount: "51-200" },
]

describe(`formatHeadcounts()`, () => {
  it(`should properly strip blank values`, () => {
    expect(formatHeadcounts(Headcounts)).toEqual([
      { label: "1-10", value: "1-10" },
      { label: "11-50", value: "11-50" },
      { label: "51-200", value: "51-200" },
    ])
  })
})
