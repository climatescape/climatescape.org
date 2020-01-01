import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import TopicCard from "../components/TopicCard"

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query HomeQuery {
      site {
        siteMetadata {
          title
        }
      }

      allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            Name
            Organizations_Count
            Slug
            Cover {
              localFiles {
                childImageSharp {
                  fluid {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
            }
          }
        }
      }

      windTurbine: file(relativePath: { eq: "images/jason-blackeye-nyL-rzwP-Mk-unsplash.jpg" }) {
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

    <div className="bg-teal-500">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 font-light tracking-wide text-gray-100">
        <h2 className="text-5xl">Mapping the global landscape</h2>
        <h3 className="text-4xl">of climate actors and resources</h3>
      </div>
    </div>

    <div id="sectors" className="bg-gray-200 py-12">
      <h3 className="text-gray-900 text-3xl font-light px-6 pt-3 pb-1 max-w-6xl mx-auto">
        Organizations by Sector
      </h3>
      <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
        {
          data.allAirtable.nodes.map(node =>
            <TopicCard title={node.data.Name} count={node.data.Organizations_Count} img={node.data.Cover.localFiles[0].childImageSharp.fluid} path={`/sectors/${node.data.Slug}`} />
          )
        }
      </div>
    </div>

    <div className="max-w-6xl mx-auto flex items-center py-4">
      <div id="about" className="text-lg px-6 py-8 text-gray-900 flex-1">
        <h2 className="text-4xl font-semibold">What is {data.site.siteMetadata.title}?</h2>
        <p className="mt-4">
          Our mission is to map the global landscape of organizations helping to create a more sustainable society.
          We created {data.site.siteMetadata.title} to enable individuals, businesses, institutions, investors, and more to
        </p>
        <p className="mt-4">
          We offer our data for free with support from a global team of volunteer contributors and editors who. All content on this site is licensed under the <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>. The source code is licensed under the MIT software license and is available on GitHub.
        </p>
      </div>
      <div className="flex-1 text-center">
        <Link to="/contribute/" className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent">Become a Contributor</Link>
      </div>
    </div>
  </Layout>
}

export default IndexPage
