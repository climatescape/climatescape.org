const algolia = require("./src/utils/algolia")

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const config = {
  siteMetadata: {
    title: `Climatescape`,
    description: `Discover the organizations solving climate change`,
    author: `@climatescape`,
    newsletterUrl: `https://climatescape.substack.com/subscribe`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: `Organizations`,
            tableView: `Published`,
            mapping: { Published: `boolean`, Logo: `fileNode` },
            tableLinks: [`Sector`, `LinkedIn_Profiles`, `Categories`],
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: `Sectors`,
            tableView: `Published`,
            mapping: { Cover: `fileNode` },
            tableLinks: [`Organizations`],
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Contributors",
            tableView: "Published",
            mapping: { Avatar: `fileNode` },
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "LinkedIn Profiles",
            tableView: "Grid view",
            mapping: { Logo: `fileNode` },
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Categories",
            mapping: { Cover: `fileNode` },
            tableView: "All Categories",
            tableLinks: [`Categories`, `Parent`],
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        defautQuality: 75,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Roboto`,
            variants: [`400`, `700`],
          },
        ],
      },
    },
  ],
}

if (process.env.ALGOLIA_ADMIN_KEY) {
  config.plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: process.env.GATSBY_ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_ADMIN_KEY,
      queries: algolia.queries,
      chunkSize: 10000,
    },
  })
}

module.exports = config
