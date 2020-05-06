import React from "react"
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import fetch from "isomorphic-fetch"
import { useAuth0 } from "./Auth0Provider"

export const ApolloProvider = ({ children }) => {
  const { getTokenSilently, isAuthenticated } = useAuth0()

  const tokenLink = setContext(async () => {
    if (!isAuthenticated) return {}

    const token = await getTokenSilently()

    if (!token) return {}

    return {
      headers: { Authorization: `Bearer ${token}` }
    }
  })

  const errorLink = onError(error => {
    console.error("Apollo error", error) // eslint-disable-line no-console
  })

  const httpLink = new HttpLink({
    uri: "https://climatescape-hasura.herokuapp.com/v1/graphql",
    fetch,
  })

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([tokenLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
