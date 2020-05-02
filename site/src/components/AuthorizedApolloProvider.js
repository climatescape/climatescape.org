import React from "react"
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { setContext } from "apollo-link-context"

export const AuthorizedApolloProvider = ({ children }) => {
  const httpLink = new HttpLink({
    uri: "https://climatescape-hasura.herokuapp.com/v1/graphql",
  })

  const authorizationLink = setContext(() => {
    const auth0Token = localStorage.getItem("idToken")

    return {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${auth0Token}`,
      },
    }
  })

  const link = ApolloLink.from([authorizationLink, httpLink])
  const cache = new InMemoryCache()
  const apolloClient = new ApolloClient({
    link,
    cache,
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
