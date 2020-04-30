// Adapted from https://auth0.com/docs/quickstart/spa/react/01-login
import React, { useState, useEffect, useContext } from "react"
import { navigate, useStaticQuery, graphql } from "gatsby"
import createAuth0Client from "@auth0/auth0-spa-js"

const DEFAULT_REDIRECT_CALLBACK = () => navigate("/")

export const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)

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
  initOptions = { client_id: clientId, domain, ...initOptions }

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

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setPopupOpen(false)
    }
    setUser(await auth0Client.getUser())
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    setUser(await auth0Client.getUser())
    setLoading(false)
    setIsAuthenticated(true)
  }
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
