const crypto = require("crypto")

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

// Given an Object `data`, return a copy with an added `digest` key, where the
// value is an MD5 digest of `data`
function addDigest(data) {
  const hash = crypto.createHash("md5")

  Object.keys(data)
    .sort()
    .forEach(key => hash.update(`${key}-${data[key]}`))

  return {
    ...data,
    digest: hash.digest("hex"),
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
      ).map(({ data }) => addDigest(transformData(data))),
    indexName: "Pages",
    settings,
  },
]
