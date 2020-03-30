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
import NetlifyLogo from "../images/netlify.svg"
import SimpleLogo from "../images/simple.svg"

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
      <Navbar />
      <main className={`flex-grow ${contentClassName}`}>{children}</main>
      <footer className="text-gray-800 bg-gray-200 text-center md:text-left py-3 md:px-6 md:flex items-center justify-between">
        <div className="">
          <span>
            ©{data.site.siteMetadata.title}&nbsp;
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-SA
            </a>
          </span>
          <span> • </span>
          <a
            href="https://twitter.com/climatescape"
            className="underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <span> • </span>
          <a
            href={data.site.siteMetadata.newsletterUrl}
            className="underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Newsletter
          </a>
        </div>
        <div className="pt-3 sm:pt-0 flex justify-center">
          <a href="https://www.netlify.com">
            <img className="h-12" src={NetlifyLogo} alt="Deploys by Netlify" />
          </a>
          <a
            href="https://simpleanalytics.com/climatescape.org"
            className="ml-2"
          >
            <img
              className="h-12"
              src={SimpleLogo}
              alt="Stats by Simple Analytics"
            />
          </a>
        </div>
      </footer>
      <script async defer src="https://sapi.climatescape.org/app.js" />
      <noscript>
        <img src="https://sapi.climatescape.org/image.gif" alt="hi" />
      </noscript>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
}

export default Layout
