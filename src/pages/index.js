import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      source: file(relativePath: { eq: "heroes/solar.jpg" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return <Layout>
    <SEO title="Home" />
    <div className="container mx-auto lg:p-4">

      <h2 className="header">All Organizations</h2>
      <iframe className="airtable-embed" title="airtable-embed" src="https://airtable.com/embed/shrqKfRNe4sz20EgX?backgroundColor=purple&viewControls=on" frameBorder="0" width="100%" height="533" style={{ background: 'transparent' }}></iframe>
      <Link to="/page-2/">Go to page 2</Link>
    </div>
  </Layout>
}

export default IndexPage
