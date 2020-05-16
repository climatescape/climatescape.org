/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { makeSlug } = require("./src/utils/slug")
const { countCategoriesOrganizations } = require("./src/utils/gatsby")
const { mirrorOrganizations } = require("./src/utils/hasura")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    fragment OrganizationCardLogo on AirtableField {
      localFiles {
        childImageSharp {
          resize(width: 256, height: 256, fit: CONTAIN, background: "white") {
            src
          }
        }
      }
    }

    fragment OrganizationCardPhoto on AirtableField {
      localFiles {
        childImageSharp {
          resize(width: 256, height: 256, fit: COVER) {
            src
          }
        }
      }
      internal {
        content
      }
    }

    fragment OrganizationCard on Airtable {
      recordId
      data {
        Name
        Homepage
        About
        Tagline
        HQ_Country
        HQ_Region
        HQ_Locality
        Organization_Type
        Headcount
        Role
        Photos {
          ...OrganizationCardPhoto
        }
        Categories {
          id
          data {
            Name
            Cover {
              ...OrganizationCardPhoto
            }
            Parent {
              id
              data {
                Name
                Cover {
                  ...OrganizationCardPhoto
                }
              }
            }
          }
        }
        Logo {
          ...OrganizationCardLogo
        }
        Crunchbase_ODM {
          data {
            Logo {
              ...OrganizationCardLogo
            }
          }
        }
        LinkedIn_Profiles {
          data {
            Logo {
              ...OrganizationCardLogo
            }
          }
        }
      }
    }

    fragment CapitalOrganizationCard on Airtable {
      ...OrganizationCard
      data {
        Capital_Profile {
          data {
            Strategic
            ImpactSpecific: Impact_Specific
            Stage
            CheckSize: Check_Size
            CapitalType: Capital_Type {
              data {
                Name
              }
            }
          }
        }
      }
    }

    query PagesQuery {
      categories: allAirtable(filter: { table: { eq: "Categories" } }) {
        nodes {
          id
          data {
            Name
            Organizations {
              id
              data {
                Role
              }
            }
            Parent {
              id
            }
          }
        }
      }
      organizations: allAirtable(filter: { table: { eq: "Organizations" } }) {
        nodes {
          id
          ...CapitalOrganizationCard
        }
      }
      capitalTypes: allAirtable(filter: { table: { eq: "Capital Types" } }) {
        nodes {
          id
          data {
            Slug
          }
        }
      }
    }
  `)

  // Mirror the organizations from Airtable to Hasura.
  mirrorOrganizations(data.organizations.nodes)

  const categoryCounts = countCategoriesOrganizations(data.categories.nodes)

  data.categories.nodes.forEach(category => {
    createPage({
      path: `/categories/${makeSlug(category.data.Name)}`,
      component: path.resolve(`./src/templates/organizations.js`),
      context: {
        categoryName: category.data.Name,
        categoryId: category.id,
        categoryCounts,
      },
    })
  })

  createPage({
    path: `/organizations`,
    component: path.resolve(`./src/templates/organizations.js`),
    context: { categoryCounts },
  })

  data.capitalTypes.nodes.forEach(({ id, data: { Slug: slug } }) => {
    createPage({
      path: `/capital/${slug}`,
      component: path.resolve(`./src/pages/capital.js`),
      context: {
        activeTypeId: id,
        active: true,
      },
    })
  })

  // Create the organizations pages
  data.organizations.nodes.forEach(org => {
    createPage({
      path: `/organizations/${makeSlug(org.data.Name)}`,
      component: path.resolve(`./src/templates/organization.js`),
      context: { id: org.id },
    })
  })
}
