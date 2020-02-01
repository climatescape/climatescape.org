/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query PagesQuery {
      sectors: allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            Slug
          }
        }
      }
      organizations: allAirtable(filter: {table: {eq: "Organizations"}}) {
        nodes {
          data {
            Slug
          }
        }
      }
    }
  `)

  // Create the sectors pages
  data.sectors.nodes.forEach(({ data }) => {
    createPage({
      path: `/sectors/${data.Slug}`,
      component: path.resolve(`./src/templates/sector.js`),
      context: { slug: data.Slug },
    })
  })

  // Create the organizations pages
  data.organizations.nodes.forEach(({ data }) => {
    createPage({
      path: `/organizations/${data.Slug}`,
      component: path.resolve(`./src/templates/organization.js`),
      context: { slug: data.Slug },
    })
  })
}
