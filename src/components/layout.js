/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Navbar from "./Navbar"

import "./layout.css"

const Layout = ({ children, contentClassName }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className="flex flex-col min-h-screen antialiased">
      <Navbar siteTitle={data.site.siteMetadata.title} />
      <main className={`flex-grow ${contentClassName}`}>{children}</main>
      <footer className="text-white p-6 bg-teal-500">
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">© CC BY-SA 4.0</a>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string
}

export default Layout
