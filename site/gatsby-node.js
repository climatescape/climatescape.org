/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { makeSlug } = require("./src/utils/slug")
const { countCategoriesOrganizations } = require("./src/utils/gatsby")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
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
          data {
            Name
            Role
          }
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

  data.capitalTypes.nodes.forEach(({ id, data: { Slug: slug }}) => {
    createPage({
      path: `/capital/${slug}`,
      component: path.resolve(`./src/pages/capital.js`),
      context: {
        activeTypeId: id,
        active: true
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
