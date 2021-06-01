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
import FooterLink from "./FooterLink"

const getFooterLinks = data => [
  {
    href: "https://twitter.com/climatescape",
    title: "Twitter",
  },
  {
    href: data.site.siteMetadata.newsletterUrl,
    title: "Newsletter",
  },
]

const Analytics = ({ host }) => {
  if (!host) return null

  return (
    <>
      <script async defer src={`${host}/app.js`} />
      <noscript>
        <img src={`${host}/image.gif`} alt="hi" />
      </noscript>
    </>
  )
}

const Layout = ({ children, contentClassName }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          newsletterUrl
          analyticsHost
        }
      }
    }
  `)

  const footerLinks = getFooterLinks(data)

  return (
    <div className="flex flex-col min-h-screen antialiased">
      <Navbar />
      <main className={`flex-grow pt-24 ${contentClassName}`}>{children}</main>
      <footer className="text-gray-800 bg-gray-200 text-center md:text-left py-3 md:px-6 md:flex items-center justify-between">
        <div className="">
          ©{data.site.siteMetadata.title}&nbsp;
          {footerLinks.map((l, i) => (
            <FooterLink
              key={l.title}
              href={l.href}
              title={l.title}
              divider={i !== footerLinks.length - 1}
            />
          ))}
        </div>
        <div className="pt-3 sm:pt-0 flex justify-center">
          <a href="https://www.netlify.com">
            <img className="h-12" src={NetlifyLogo} alt="Deploys by Netlify" />
          </a>
        </div>
      </footer>
      <Analytics host={data.site.siteMetadata.analyticsHost} />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
}

export default Layout
