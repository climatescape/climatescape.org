import React, { useState } from "react"

import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ContributorCard from "../components/ContributorCard"

const ContributePage = () => {
  const [open, setOpen] = useState(false)

  const contributorData = useStaticQuery(graphql`
    query ContributorsQuery {
      contributors: allAirtable(filter: { table: { eq: "Contributors" } }) {
        nodes {
          data {
            Name
            Join_Date
            Contributions
            Website
            Avatar {
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

  const contributors = contributorData.contributors.nodes
    .sort((a, b) => a.data.Join_Date > b.data.Join_Date)
    .map(({ data: { Name, Avatar, Contributions, Website } }) => ({
      name: Name,
      avatar:
        Avatar &&
        Avatar.localFiles &&
        Avatar.localFiles[0] &&
        Avatar.localFiles[0].childImageSharp &&
        Avatar.localFiles[0].childImageSharp.fluid,
      contributions: Contributions,
      website: Website,
    }))

  return (
    <Layout>
      <SEO title="Contribute to Climatescape" />
      <div className="flex flex-col mx-auto container lg:flex-row">
        <div className="lg:w-2/5 bg-blue-100">
          <div className="p-3 pb-6 lg:p-6">
            <div>
              <h1 className="text-gray-900 text-2xl md:text-3xl font-light my-3">
                How to Contribute
              </h1>
              <p className="my-2">
                Climatescape is maintained by a global team of volunteers. If
                you&#39;re interested in joining us, here are the ways you can
                help:
              </p>
              <ol className="list-decimal list-outside ml-5">
                <li className="mt-1">
                  The easiest way to contribute is to submit organizations
                  we&#39;re missing using the form on this page
                </li>
                <li className="mt-1">
                  Apply to join our{" "}
                  <a
                    className="underline hover:no-underline text-blue-600"
                    href="mailto:brendan@sinceresoftware.co"
                  >
                    editorial team
                  </a>
                </li>
                <li className="mt-1">
                  Contribute to the development of this website{" "}
                  <a
                    className="underline hover:no-underline text-blue-600"
                    href="https://github.com/bloudermilk/climatescape/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22"
                  >
                    on GitHub
                  </a>
                </li>
              </ol>
              <p className="my-2">
                Want to help another way?{" "}
                <a
                  className="underline hover:no-underline text-blue-600"
                  href="mailto:brendan@sinceresoftware.co"
                >
                  Contact us
                </a>
              </p>
            </div>
          </div>
          <div className="p-3 pb-6 bg-blue-100 lg:p-6">
            <div className="flex justify-between">
              <div className="text-gray-900 text-2xl md:text-3xl font-light mb-3">
                Contributors
              </div>
              <button
                className="lg:hidden"
                onClick={() => setOpen(!open)}
                style={{ transform: open ? "none" : "rotateX( 180deg )" }}
              >
                <svg
                  className="fill-current w-10 h-10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
                </svg>
              </button>
            </div>
            <div className={`${open ? "block" : "hidden"} lg:block`}>
              {contributors.map(contributor => (
                <ContributorCard
                  name={contributor.name}
                  contributions={contributor.contributions}
                  avatar={contributor.avatar}
                  website={contributor.website}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-3/5 border-gray-300 lg:border-r">
          <iframe
            title="Public Submission Form"
            className="airtable-embed"
            src="https://airtable.com/embed/shrWzh6qSX3wHXM9a?backgroundColor=teal"
            frameBorder="0"
            onmousewheel=""
            width="100%"
            height="1150"
            style={{ background: "transparent" }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default ContributePage
