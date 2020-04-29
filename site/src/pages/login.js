import React from "react"

import { useAuth0 } from "../components/Auth0Provider"
import Layout from "../components/layout"

// TODO: This page is only necessary until we add login to the Navbar
const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <Layout contentClassName="text-center pt-16">
      <p className="lg:text-xl">
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect({})}>Log in</button>
        )}
        {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
      </p>
    </Layout>
  )
}

export default LoginPage
