import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost"
import { ApolloProvider as VanillaApolloProvider } from "react-apollo"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import fetch from "isomorphic-fetch"
import { useAuth0 } from "./Auth0Provider"

export const ApolloProvider = ({ children }) => {
  const { getTokenSilently, isAuthenticated } = useAuth0()
  const {
    site: { siteMetadata },
  } = useStaticQuery(graphql`
    query ApolloProviderQuery {
      site {
        siteMetadata {
          graphqlUri
        }
      }
    }
  `)

  const tokenLink = setContext(async () => {
    if (!isAuthenticated) return {}

    const token = await getTokenSilently()

    if (!token) return {}

    return {
      headers: { Authorization: `Bearer ${token}` },
    }
  })

  const errorLink = onError(error => {
    console.error("Apollo error", error) // eslint-disable-line no-console
  })

  const httpLink = new HttpLink({
    uri: siteMetadata.graphqlUri,
    fetch,
  })

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([tokenLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })

  return (
    <VanillaApolloProvider client={apolloClient}>
      {children}
    </VanillaApolloProvider>
  )
}
