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
        <h2 className="text-2xl md:text-3xl font-light">
          What is Climatescape?
        </h2>
        <p className="mt-3">
          Out mission is to organize the global ecosystem of organizations fighting climate change. Our website
          includes a directory of thouseands of companies, investors, NGOs, and other organizations that support climate solutions.
        </p>
        <p className="mt-3">
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
          license. This website is open source {" "}
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
        <p className="mt-4 text-center">
          <Link
            to="/contribute/"
            className="text-xl px-4 py-2 inline-block mx-auto leading-none border rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500"
          >
            Become a Contributor
          </Link>
        </p>
        <h2 className="mt-12 text-2xl md:text-3xl font-light">More is Coming</h2>
        <p className="mt-4">
          The website you see today is only the beginning. Our team is already
          designing the next iteration of Climatescape and we want your help.
        </p>
        <p className="mt-4">
          Follow{" "}
          <a
            href="https://twitter.com/climatescape"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            @climatescape
          </a>{" "}
          on Twitter and subscribe to{" "}
          <a
            href="https://climatescape.substack.com/embed"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            our newsletter
          </a>{" "}
          to help shape our future.
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
