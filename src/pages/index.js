import React from "react"
import { Link, graphql } from "gatsby"

import { transformCategories, transformCapitalTypes } from "../utils/airtable"

import Layout from "../components/layout"
import SEO from "../components/seo"
import TopicCard from "../components/TopicCard"

function ViewAll({ name, href }) {
  return (
    <div className="text-center">
      <Link to={href} className="text-lg text-blue-600 hover:text-blue-700">
        View All {name} <span className="text-2xl">&rsaquo;</span>
      </Link>
    </div>
  )
}

export default function IndexPage({ data }) {
  const categories = transformCategories(data.categories.nodes)
  const capitalTypes = transformCapitalTypes(data)

  const topCategories = categories.filter(cat => !cat.parent)

  return (
    <Layout contentClassName="text-gray-900">
      <SEO />

      <h2 className="font-bold text-2xl md:text-4xl text-center font-light tracking-wide text-gray-800 px-2 sm:px-6 pt-8 pb-4 md:pt-16 md:pb-8">
        Discover&nbsp;the&nbsp;organizations <br />{" "}
        solving&nbsp;climate&nbsp;change
      </h2>

      <div id="organizations" className="md:py-6">
        <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
          {topCategories.map(cat => (
            <TopicCard category={cat} key={cat.name} />
          ))}
        </div>
        <ViewAll href="/organizations" name="Organizations" />
      </div>

      <div className="bg-gray-200 pb-12 my-12">
        <div id="organizations" className="py-6">
          <h2 className="font-bold text-2xl md:text-4xl text-center font-light tracking-wide text-gray-800 mt-6 mb-3">
            Capital &amp; Startup Programs
          </h2>
          <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
            {capitalTypes.map(({ name, slug, cover }) => (
              <TopicCard
                key={slug}
                category={{
                  slug,
                  cover,
                  name,
                }}
              />
            ))}
          </div>
          <ViewAll href="/capital" name="Capital" />
        </div>
      </div>

      <div id="about" className="max-w-6xl mx-auto lg:flex items-start py-4">
        <div className="text-lg px-6 py-6 flex-1">
          <h2 className="text-2xl md:text-3xl font-light">
            What is Climatescape?
          </h2>
          <p className="mt-4">
            Climatescape is an open database of organizations leading the fight
            against climate change.
          </p>
          <p className="mt-4">
            Our content is community-moderated and published under the
            permissive{" "}
            <a
              href="http://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Creative Commons BY-SA
            </a>{" "}
            license. This website is open source and available{" "}
            <a
              href="https://github.com/climatescape/climatescape.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              on GitHub
            </a>
            .
          </p>
          <p className="mt-8 text-center">
            <Link
              to="/contribute/"
              className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent"
            >
              Become a Contributor
            </Link>
          </p>
        </div>
        <div className="text-lg px-6 py-6 flex-1">
          <h2 className="text-2xl md:text-3xl font-light">More is Coming</h2>
          <p className="mt-4">
            The website you see today is only the beginning. Our team is already
            designing the next iteration of Climatescape and we want your help.
          </p>
          <p className="mt-4">
            Follow us on Twitter (
            <a
              href="https://twitter.com/climatescape"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              @climatescape
            </a>
            ) and subscribe to our newsletter to help shape our future.
          </p>
          <p className="mt-8 text-center">
            <a
              href={data.site.siteMetadata.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-2xl px-4 py-2 border-2 rounded text-white bg-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500 hover:bg-transparent"
            >
              Subscribe Here
            </a>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        newsletterUrl
      }
    }

    capitalTypes: allAirtable(filter: { table: { eq: "Capital Types" } }) {
      nodes {
        id
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
    categories: allAirtable(filter: { table: { eq: "Categories" } }) {
      nodes {
        id
        data {
          Name
          Parent {
            id
            data {
              Name
            }
          }
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
`
