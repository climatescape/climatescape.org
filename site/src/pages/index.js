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
  const capitalTypes = transformCapitalTypes(data.capitalTypes.nodes)

  const topCategories = categories.filter(cat => !cat.parent)

  return (
    <Layout contentClassName="text-gray-900">
      <SEO />

      <h2 className="font-bold text-2xl md:text-4xl text-center tracking-wide text-gray-800 px-2 sm:px-6 pt-8 pb-4 md:pt-16 md:pb-8">
        Discover&nbsp;the&nbsp;organizations <br />{" "}
        solving&nbsp;climate&nbsp;change
      </h2>

      <div className="pt-4 pb-8 md:pt-8 md:pb-12">
        <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
          {topCategories.map(cat => (
            <TopicCard category={cat} key={cat.name} className="md:w-1/4" />
          ))}
        </div>
        <ViewAll href="/organizations" name="Organizations" />
      </div>

      <div className="bg-gray-200 pt-4 pb-8 md:pt-8 md:pb-12">
        <h2 className="font-bold text-2xl md:text-4xl text-center tracking-wide text-gray-800 my-6">
          Capital &amp; Startup Programs
        </h2>
        <div className="p-3 flex flex-wrap max-w-6xl mx-auto">
          {capitalTypes.map(({ name, slug, cover }) => (
            <TopicCard
              key={slug}
              className="md:w-1/3"
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

      <div className="max-w-xl mx-auto px-3 text-lg pt-12 pb-6">
        <h2 className="text-2xl md:text-3xl font-light">Follow Climate Tech</h2>

        <p className="my-2">
          Subscribe to our newsletter to get access to startup profiles, market
          deep-dives, and the most important headlines in climate tech.
        </p>

        <iframe
          title="Climatescape Newsletter"
          src="https://climatescape.substack.com/embed"
          width="100%"
          height="320"
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </Layout>
  )
}

export const query = graphql`
  fragment HomepageCover on AirtableField {
    localFiles {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }

  query HomeQuery {
    site {
      siteMetadata {
        newsletterUrl
      }
    }

    capitalTypes: allAirtable(
      filter: { table: { eq: "Capital Types" }, data: { Count: { gte: 3 } } }
      sort: { fields: [data___Count], order: DESC }
    ) {
      nodes {
        id
        data {
          Name
          Slug
          Cover {
            ...HomepageCover
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
            ...HomepageCover
          }
        }
      }
    }
  }
`
