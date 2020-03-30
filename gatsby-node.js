/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const { makeSlug } = require("./src/utils/slug")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query PagesQuery {
      categories: allAirtable(filter: { table: { eq: "Categories" } }) {
        nodes {
          id
          data {
            Name
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
    }
  `)

  // const categories = transformCategories(data)
  data.categories.nodes
    .filter(category => !category.data.Parent)
    .forEach(category => {
      createPage({
        path: `/categories/${makeSlug(category.data.Name)}`,
        component: path.resolve(`./src/pages/organizations.js`),
        context: {
          categoryName: category.data.Name,
          categoryId: category.id,
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
