// Adapted from https://auth0.com/docs/quickstart/spa/react/01-login
import React, { useState, useEffect, useContext } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"
import createAuth0Client from "@auth0/auth0-spa-js"

const DefaultRedirectCallback = ({ returnTo }) => {
  navigate(returnTo || "/")
}

export const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)
export const Auth0Provider = ({
  audience,
  children,
  onRedirectCallback = DefaultRedirectCallback,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)

  const data = useStaticQuery(graphql`
    query Auth0ProviderQuery {
      site {
        siteMetadata {
          auth0 {
            clientId
            domain
          }
        }
      }
    }
  `)

  const {
    site: {
      siteMetadata: {
        auth0: { clientId, domain },
      },
    },
  } = data
  initOptions = {
    client_id: clientId,
    domain,
    audience: "hasura-api",
    ...initOptions,
  }

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const localIsAuthenticated = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(localIsAuthenticated)

      if (localIsAuthenticated) {
        setUser(await auth0FromHook.getUser())
      }

      setLoading(false)
    }
    initAuth0()
  }, [])

  const loginWithRedirect = (args = {}) => {
    return auth0Client.loginWithRedirect({
      appState: { returnTo: window.location.pathname },
      ...args,
    })
  }

  const logout = (args = {}) => {
    return auth0Client.logout({
      returnTo: window.location.origin,
      ...args,
    })
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        loginWithRedirect,
        logout,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
