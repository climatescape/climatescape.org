const chunk = require("lodash/chunk")
const gql = require("graphql-tag")
const { ApolloClient } = require("apollo-boost")
const { fetch } = require("isomorphic-fetch")
const { HttpLink } = require("apollo-boost")
const { InMemoryCache } = require("apollo-boost")
const { transformOrganization } = require("./helpers")

// Gatsby does not support mutations because it is designed to expect
// mutations to occur only on the client and not at build time.
// See: https://github.com/gatsbyjs/gatsby/issues/13704
// In order to run mutations at build time, we are using Apollo.

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPHQL_URI,
    headers: {
      "X-Hasura-Admin-Secret": process.env.GRAPHQL_ADMIN_SECRET,
    },
    fetch,
  }),
  cache: new InMemoryCache(),
})

const mutation = gql`
  mutation MirrorOrganizations($objects: [organizations_insert_input!]!) {
    insert_organizations(
      objects: $objects
      on_conflict: {
        constraint: organizations_record_id_key
        update_columns: [data]
      }
    ) {
      affected_rows
    }
  }
`

async function asyncForEach(array, callback) {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array) // eslint-disable-line no-await-in-loop
  }
}

async function mirrorOrganizations(orgs) {
  const transformedOrganizations = orgs.map(org => {
    const { recordId } = org
    return {
      data: transformOrganization(org),
      record_id: recordId,
    }
  })

  const batches = chunk(transformedOrganizations, 100)
  await asyncForEach(batches, organizations => {
    apolloClient
      .mutate({
        mutation,
        variables: {
          objects: organizations,
        },
      })
      .then(result => {
        // eslint-disable-next-line no-console
        console.log("Hasura upsert result: ", result.data)
      })
      // eslint-disable-next-line no-console
      .catch(e => console.error(e))
  })
}

module.exports = {
  mirrorOrganizations,
}
