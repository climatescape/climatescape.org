const { countCategoriesOrganizations } = require("./gatsby.js")

const Categories = [
  {
    id: "cat1",
    data: {
      Organizations: [
        {
          id: "org1",
          data: {
            Role: ["Network"],
          },
        },
      ],
    },
  },
  {
    id: "cat2",
    data: {
      Parent: [{ id: "cat1" }],
      Organizations: [
        {
          id: "org2",
          data: {
            Role: ["Network"],
          },
        },
      ],
    },
  },
  {
    id: "cat3",
    data: {
      Organizations: [
        {
          id: "org3",
          data: {
            Role: ["Network"],
          },
        },
      ],
    },
  },
]

describe(`countCategoriesOrganizations()`, () => {
  it(`should properly count unique orgs in each category`, () => {
    expect(countCategoriesOrganizations(Categories)).toEqual({
      cat1: 2,
      cat2: 1,
      cat3: 1,
    })
  })
})
