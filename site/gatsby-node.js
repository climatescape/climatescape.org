/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

const makeSlug = require(`./src/utils/slug`).makeSlug

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query PagesQuery {
      sectors: allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            slug: Slug
            name: Name
          }
        }
      }
      organizations: allAirtable(filter: {table: {eq: "Organizations"}}) {
        nodes {
          data {
            ID
            Name
          }
        }
      }
    }
  `)

  // Create the sectors pages
  data.sectors.nodes.forEach(({ data }) => {
    createPage({
      path: `/sectors/${data.slug}`,
      component: path.resolve(`./src/pages/organizations.js`),
      context: {
        sectorName: data.name,
        slugRegex: `/${data.slug}/`,
      },
    })
  })

  // Create the organizations pages
  data.organizations.nodes.forEach(({ data }) => {
    createPage({
      path: `/organizations/${makeSlug(data.Name)}`,
      component: path.resolve(`./src/templates/organization.js`),
      context: { id: data.ID },
    })
  })
}
