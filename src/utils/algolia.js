const { makeSlug } = require("./slug")

const pageQuery = `query PagesQuery {
  organizations: allAirtable(filter: {table: {eq: "Organizations"}}) {
    nodes {
      data {
        Name
        HQ_Location
        Headcount
        About
        Tagline
        Logo {
          raw {
            url
          }
        }
        Categories {
          data {
            Name
          }
        }
        LinkedIn_Profiles {
          id
          data {
            Logo {
              raw {
                url
              }
            }
          }
        }
      }
    }
  }
}
`

function getLogo({ Logo, LinkedIn }) {
  const rawLogo = Logo || (LinkedIn && LinkedIn.Logo)
  if (!rawLogo) {
    return ""
  }
  return rawLogo.raw[0].url || ""
}

function transformData(data) {
  const categories = data.Categories
    ? data.Categories.map(category => category.data.Name)
    : []

  return {
    objectID: makeSlug(data.Name),
    name: data.Name,
    path: makeSlug(data.Name),
    location: data.HQ_Location,
    headCount: data.Headcount,
    about: data.About,
    tagLine: data.Tagline,
    logo: getLogo(data),
    categories,
  }
}

const settings = { attributesToSnippet: ["excerpt:20"] }

module.exports.queries = [
  {
    query: pageQuery,
    transformer: ({ data: transformedData }) =>
      (transformedData
        ? transformedData.organizations.nodes
        : []
      ).map(({ data }) => transformData(data)),
    indexName: "Pages",
    settings,
  },
]
