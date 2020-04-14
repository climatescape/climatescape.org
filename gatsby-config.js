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
    capitalAddFormUrl: `https://airtable.com/shrBK2iC6AQ4Yb2lq`,
    capitalEditFormUrl: `https://airtable.com/shrFuDB1VcHqlYd1d`,
    organizationAddFormUrl: `https://airtable.com/shrquIaKs7TQDqFFY`,
    organizationEditFormUrl: `https://airtable.com/shrgoaO5ppAxlqt31`,
    contributorFormUrl: `https://airtable.com/shr4WZDPBs7mk1doW`,
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
            mapping: {
              Published: `boolean`,
              Logo: `fileNode`,
              Photos: `fileNode`,
            },
            tableLinks: [
              `LinkedIn_Profiles`,
              `Categories`,
              `Capital_Profile`,
              "Crunchbase_ODM",
              `Source`,
            ],
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
            tableLinks: [`Parent`, `Organizations`],
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Capital Profiles",
            tableLinks: [`Organization`, `Capital_Type`],
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Crunchbase ODM",
            tableLinks: [`Organization`],
            mapping: { Logo: `fileNode` },
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Sources",
            tableLinks: [`Organizations`],
          },
          {
            baseId: `appNYMWxGF1jMaf5V`,
            tableName: "Capital Types",
            tableLinks: [`Capital_Profiles`],
            mapping: { Cover: `fileNode` },
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
          { family: "Roboto Mono" },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // The default spinner shows up in the top-right corner of the page,
        // just on top of our nav bar. Setting this to false still gives us the
        // loading bar at the top of the page, which is good enough to indicate
        // something is happening when visiting a slow page.
        showSpinner: false,
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
