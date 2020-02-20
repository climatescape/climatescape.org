const { makeSlug } = require("./slug")

const pageQuery = `query PagesQuery {
  organizations: allAirtable(filter: {table: {eq: "Organizations"}}) {
    nodes {
      data {
        Name
        Logo {
          raw {
            url
          }
        }
        Sector {
          data {
            Slug
          }
        }
      }
    }
  }
}
`

const settings = { attributesToSnippet: ["excerpt:20"] }

module.exports.queries = [
  {
    query: pageQuery,
    transformer: ({ data: transformedData }) =>
      (transformedData ? transformedData.organizations.nodes : []).map(
        ({ data }) => ({
          objectID: makeSlug(data.Name),
          name: data.Name,
          path: makeSlug(data.Name),
          logo: !data.Logo ? "" : data.Logo.raw[0].url,
          sector: !data.Sector
            ? ""
            : data.Sector.map(sector => sector.data.Slug),
        })
      ),
    indexName: "Pages",
    settings,
  },
]
