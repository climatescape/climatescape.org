import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, ApolloProvider as VanillaApolloProvider } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
// import fetch from "isomorphic-fetch"
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

  // TODO: This total hack can be removed once we fix site builds with https
  // for now, the ENV var is insecure by default but we need to secure it
  // for the client in order to prevent "mixed content" errors
  const uri = siteMetadata.graphqlUri.replace("http://", "https://")
  const httpLink = new HttpLink({
    uri,
    // fetch,
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
