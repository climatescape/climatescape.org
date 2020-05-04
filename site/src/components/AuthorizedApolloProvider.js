import React from "react"
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { setContext } from "apollo-link-context"
import fetch from "isomorphic-fetch"
import { useAuth0 } from "./Auth0Provider"

export const AuthorizedApolloProvider = ({ children }) => {
  const { getTokenSilently, loading } = useAuth0()

  let token

  const tokenLink = setContext(async () => {
    if (token) return { auth0Token: token }
    if (loading) return new Promise(() => {})
    token = await getTokenSilently()
    return { auth0Token: token }
  })

  const httpLink = new HttpLink({
    uri: "https://climatescape-hasura.herokuapp.com/v1/graphql",
    fetch,
  })

  const authorizationLink = setContext((_, { auth0Token }) => {
    return {
      headers: {
        "content-type": "application/json",
        ...(auth0Token ? { Authorization: `Bearer ${auth0Token}` } : {}),
      },
    }
  })

  const link = ApolloLink.from([tokenLink, authorizationLink, httpLink])
  const cache = new InMemoryCache()
  const apolloClient = new ApolloClient({
    link,
    cache,
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
