const algolia = require("./src/utils/algolia")
const { from, HttpLink } = require("@apollo/client")
const { RetryLink } = require("@apollo/client/link/retry")

require("dotenv").config({
  path: `../.env.${process.env.NODE_ENV}`,
})

const RequiredEnv = [
  `GRAPHQL_URI`,
  `AIRTABLE_BASE_ID`,
  `AIRTABLE_API_KEY`,
  `AUTH0_DOMAIN`,
  `AUTH0_CLIENT_ID`,
  `GATSBY_ALGOLIA_APP_ID`,
  `GATSBY_ALGOLIA_SEARCH_KEY`,
]

const missingEnv = RequiredEnv.filter(key => !process.env[key])

// Fail fast if any of the required ENV variables are missing
if (missingEnv.length) {
  throw new Error(`
    The following variable(s) are missing from .env.${process.env.NODE_ENV}:
    ${missingEnv.join(`, `)}
    Open .env.sample to learn how to fix this.
  `)
}

const graphqlUri = process.env.GRAPHQL_URI

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
    analyticsHost: process.env.ANALYTICS_HOST || "",
    auth0: {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
    },
    graphqlUri,
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
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `Climatescape`,
        fieldName: `climatescape`,
        createLink: () => from([
          new RetryLink(),
          new HttpLink({ uri: graphqlUri }),
        ]),
        batch: true,
        dataLoaderOptions: {
          maxBatchSize: 10,
        },
      },
    },
    {
      resolve: `gatsby-source-airtable`,
      options: {
        apiKey: process.env.AIRTABLE_API_KEY,
        tables: [
          {
            baseId: process.env.AIRTABLE_BASE_ID,
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
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Contributors",
            tableView: "Published",
            mapping: { Avatar: `fileNode` },
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "LinkedIn Profiles",
            tableView: "Grid view",
            mapping: { Logo: `fileNode` },
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Categories",
            mapping: { Cover: `fileNode` },
            tableView: "All Categories",
            tableLinks: [`Parent`, `Organizations`],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Capital Profiles",
            tableLinks: [`Organization`, `Capital_Type`],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Crunchbase ODM",
            tableLinks: [`Organization`],
            mapping: { Logo: `fileNode` },
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
            tableName: "Sources",
            tableLinks: [`Organizations`],
          },
          {
            baseId: process.env.AIRTABLE_BASE_ID,
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
        defaultQuality: 75,
        checkSupportedExtensions: false,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
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
      enablePartialUpdates: true,
      matchFields: ["digest"],
    },
  })
}

module.exports = config
