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
          newsletterUrl
        }
      }

      sectors: allAirtable(filter: {table: {eq: "Sectors"}}) {
        nodes {
          data {
            Name
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
    }
  `)



  const sectors = data.sectors.nodes.sort((a, b) => stringCompare(a.data.Name, b.data.Name))

  return <Layout contentClassName="text-gray-900">
    <SEO />

    <h2 className="bg-teal-500 text-2xl md:text-4xl text-center font-light tracking-wide text-white px-2 sm:px-6 pt-8 pb-16 md:pt-12 md:pb-24">
      Discover&nbsp;the&nbsp;organizations solving&nbsp;climate&nbsp;change
    </h2>

    <div id="organizations" className="py-6 md:py-12 bg-teal-100">
      <h2 className="text-2xl md:text-3xl font-light px-6 pt-3 pb-1 max-w-6xl mx-auto">
        Browse by Sector
      </h2>
      <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
        {
          sectors.map((node, index) =>
            <TopicCard
              title={node.data.Name}
              img={node.data.Cover.localFiles[0].childImageSharp.fluid}
              path={`/sectors/${node.data.Slug}`}
              key={index}
            />
          )
        }
      </div>
    </div>

    <div id="about" className="max-w-6xl mx-auto lg:flex items-start py-4">
      <div className="text-lg px-6 py-6 flex-1">
        <h2 className="text-2xl md:text-3xl font-light">What is Climatescape?</h2>
        <p className="mt-4">
          Climatescape is an open database of organizations leading the fight against climate change.
        </p>
        <p className="mt-4">
          Our content is community-moderated and published under the permissive <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Creative Commons BY-SA</a> license.
          This website is open source and available <a href="https://github.com/climatescape/climatescape.org" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">on GitHub</a>.
        </p>
        <p className="mt-8 text-center">
          <Link to="/contribute/" className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent">Become a Contributor</Link>
        </p>
      </div>
      <div className="text-lg px-6 py-6 flex-1">
        <h2 className="text-2xl md:text-3xl font-light">More is Coming</h2>
        <p className="mt-4">
          The website you see today is only the beginning. Our team is already
          designing the next iteration of Climatescape and we want your help.
        </p>
        <p className="mt-4">
          Follow us on Twitter
          (<a href="https://twitter.com/climatescape" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">@climatescape</a>)
          and subscribe to our newsletter to help shape our future.
        </p>
        <p className="mt-8 text-center">
          <a
            href={data.site.siteMetadata.newsletterUrl}
            target="_blank" rel="noopener noreferrer"
            className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent"
          >
            Subscribe Here
          </a>
        </p>
      </div>
    </div>
  </Layout>
}

export default IndexPage
