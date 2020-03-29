import React from "react"

import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="flex flex-col h-30">
      <h1 className="text-center font-bold text-3xl m-2">NOT FOUND</h1>
      <p className="text-center text-md h-12 lg:text-xl">
        You just hit a route that doesn&#39;t exist... the sadness.
      </p>
      <p className="text-center m-2">
        Return to{" "}
        <Link to="/" className="text-blue-400">
          Home Page
        </Link>
      </p>
    </div>
  </Layout>
)

export default NotFoundPage
