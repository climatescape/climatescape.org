import React, { useState, useEffect } from "react"

import { useAuth0 } from "../components/Auth0Provider"
import Layout from "../components/layout"

// TODO: This page is only necessary until we add login to the Navbar
const LoginPage = () => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getTokenSilently,
  } = useAuth0()
  const [token, setToken] = useState()

  useEffect(() => {
    if (loading) return
    getTokenSilently().then(setToken)
  }, [loading])

  return (
    <Layout contentClassName="text-center pt-16">
      <p className="lg:text-xl">
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        )}
        {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
      </p>
      <pre className="text-left">User: {JSON.stringify(user, null, 2)}</pre>
      <pre>Token: {token}</pre>
    </Layout>
  )
}

export default LoginPage
