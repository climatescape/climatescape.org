import React from "react"

import Layout from "../components/layout"

// Auth0 will redirect back to this page after a user logs in. Auth0Provider
// will then pick up the #hash information from Auth0 and finish the log in,
// culminating in a redirect away from this page.
const Authback = () => (
  <Layout contentClassName="text-center pt-16">
    <h1 className="font-bold text-3xl m-2">Just a moment...</h1>
    <p className="lg:text-xl">We&apos;re logging you in now</p>
  </Layout>
)

export default Authback
