import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import { stringCompare } from "../utils/string"

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

      sectors: allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            Name
            Organizations_Count
            Slug
            Cover {
              localFiles {
                childImageSharp {
                  fluid(maxWidth: 500) {
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



  const sectors = data.sectors.nodes.sort((a, b) => stringCompare(a.data.Name, b.data.Name))

  return <Layout>
    <SEO />

    <div className="bg-teal-500">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 md:pt-16 md:pb-24 font-light tracking-wide text-gray-100">
        <h2 className="text-3xl md:text-5xl">Mapping the global landscape</h2>
        <h3 className="text-2xl md:text-4xl">of climate-saving organizations and resources</h3>
      </div>
    </div>

    <div id="organizations" className="bg-gray-200 py-6 md:py-12">
      <h2 className="text-gray-900 text-2xl md:text-3xl font-light px-6 pt-3 pb-1 max-w-6xl mx-auto">
        Explore Organizations by Sector
      </h2>
      <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
        {
          sectors.map((node, index) =>
            <TopicCard
              title={node.data.Name}
              count={node.data.Organizations_Count}
              img={node.data.Cover.localFiles[0].childImageSharp.fluid}
              path={`/sectors/${node.data.Slug}`}
              key={index}
            />
          )
        }
      </div>
    </div>

    <div className="max-w-6xl mx-auto lg:flex items-center py-4">
      <div id="about" className="text-lg px-6 pt-6 pb-8 text-gray-900 flex-1">
        <h2 className="text-2xl md:text-3xl font-light">What is {data.site.siteMetadata.title}?</h2>
        <p className="mt-4">
          Our mission is to map the global landscape of organizations helping to create a more sustainable society, along with resources for learning about and implementing solutions to save the climate.
        </p>
        <p className="mt-4">
          Our content is offered for free by a team of volunteer contributors and editors. All data on this site is released under the <a href="http://creativecommons.org/licenses/by-sa/4.0/" className="underline hover:no-underline">Creative Commons BY-SA License</a>, a permissive "Free Culture" license.
          The website source code is open source (MIT software license) and is available <a href="https://github.com/bloudermilk/climatescape" className="underline hover:no-underline">on GitHub</a>.
        </p>
      </div>
      <div className="flex-1 text-center py-10">
        <Link to="/contribute/" className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent">Become a Contributor</Link>
      </div>
    </div>
  </Layout>
}

export default IndexPage
