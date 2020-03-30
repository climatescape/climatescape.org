import React from "react"

import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="flex flex-col h-30 mx-8">
      <h1 className="text-center font-bold text-3xl m-2">PAGE NOT FOUND</h1>
      <p className="text-center text-md h-20 md:h-12 lg:text-xl lg:h-12">
        It looks like the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="text-center text-md h-20 md:h-12 lg:text-lg lg:h-12">
        Try using the search bar at the top of the page or browse the website
        from the homepage.
      </p>
      <p className="text-center m-2">
        Visit the{" "}
        <Link to="/" className="text-blue-400">
          homepage
        </Link>
      </p>
    </div>
  </Layout>
)

export default NotFoundPage
