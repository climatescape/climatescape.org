const gql = require("graphql-tag")
const { ApolloClient } = require("apollo-boost")
const { fetch } = require("isomorphic-fetch")
const { HttpLink } = require("apollo-boost")
const { InMemoryCache } = require("apollo-boost")
const { transformOrganization } = require("./transformHelpers")

require("dotenv").config({
  path: `../../../../.env.${process.env.NODE_ENV}`,
})

// Gatsby does not support mutations because it is designed to expect
// mutations to occur only on the client and not at build time.
// See: https://github.com/gatsbyjs/gatsby/issues/13704
// In order to run mutations at build time, we are using Apollo.

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPHQL_URI,
    fetch,
  }),
  cache: new InMemoryCache(),
})

const mutation = gql`
  mutation AddOrganizations($objects: [organizations_insert_input!]!) {
    insert_organizations(
      objects: $objects
      on_conflict: {
        constraint: organizations_record_id_key
        update_columns: [updated_at, data]
      }
    ) {
      affected_rows
      returning {
        created_at
        data
        id
        record_id
        updated_at
      }
    }
  }
`

// This helper runs the upsert mutation.
function mirrorOrganizations(orgs) {
  const transformedOrganizations = orgs.map(org => {
    const { recordId } = org
    return {
      data: transformOrganization(org),
      record_id: recordId,
    }
  })

  // Create a batch mutation of all organizations.
  apolloClient
    .mutate({
      mutation,
      variables: {
        objects: transformedOrganizations,
      },
    })
    .then(result => {
      console.log("Hasura upsert result: ", result.data)
    })
    .catch(e => console.log(e))
}

module.exports = {
  mirrorOrganizations,
}
