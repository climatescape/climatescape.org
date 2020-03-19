import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUsers,
  faBuilding,
  faLocationArrow,
  faTag,
} from "@fortawesome/free-solid-svg-icons"

import OrganizationSocial from "../components/OrganizationSocial"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Section from "../components/Section"
import { transformOrganization } from "../utils/airtable"

export default function OrganizationTemplate({ data }) {
  const siteTitle = data.site.siteMetadata.title
  const org = transformOrganization(data.organization)

  const topCategories = org.categories.filter(cat => !cat.parent)
  const subCategories = org.categories.filter(cat => cat.parent)
  const topCategory = topCategories[0] || subCategories[0]?.parent

  // Show all sub categories as well as top categories not represented
  // by sub categories
  const categoryList = topCategories
    .filter(
      category => !subCategories.map(cat => cat.parent.id).includes(category.id)
    )
    .concat(subCategories)

  return (
    <Layout contentClassName="bg-gray-200">
      <SEO title={`${org.title} on ${siteTitle}`} description={org.tagline} />

      <div className="max-w-4xl mx-auto pb-4">
        {topCategory && (
          <Link
            to={topCategory.slug}
            className="inline-block text-lg pt-3 px-2 text-gray-700 hover:text-teal-900"
          >
            &laquo; {topCategory.name}
          </Link>
        )}

        <Section>
          <div className="flex items-center text-gray-900">
            {org.logo && <Img fixed={org.logo} className="mr-3 w-16 h-16" />}

            <h1 className="flex-grow text-xl font-semibold">{org.title}</h1>
          </div>

          <h2 className="my-5 pl-3 lg:my-6 border-l-4 border-teal-500 border-solid font-semibold">
            {org.tagline}
          </h2>

          {org.about && org.about !== org.tagline && (
            <div className="my-3">{org.about}</div>
          )}

          <ul>
            {org.location && (
              <li>
                <span className="w-8 inline-block">
                  <FontAwesomeIcon
                    icon={faLocationArrow}
                    className="mx-1 text-gray-700"
                  />
                </span>
                {org.location}
              </li>
            )}
            {org.headcount && (
              <li>
                <span className="w-8 inline-block">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="mx-1 text-gray-700"
                  />
                </span>
                {org.headcount} employees
              </li>
            )}
            {org.orgType && (
              <li>
                <span className="w-8 inline-block">
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="mx-1 text-gray-700"
                  />
                </span>
                {org.orgType}
              </li>
            )}
            {categoryList.map(category => (
              <li key={category.name}>
                <span className="w-8 inline-block">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="mx-1 text-gray-700"
                  />
                </span>
                <Link to={category?.parent?.slug ?? category.slug}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <OrganizationSocial
            homepage={org.homepage}
            linkedIn={org.linkedIn}
            twitter={org.twitter}
          />
        </Section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query OrganizationPageQuery($id: String) {
    site {
      siteMetadata {
        title
      }
    }

    organization: airtable(table: { eq: "Organizations" }, id: { eq: $id }) {
      data {
        Logo {
          localFiles {
            childImageSharp {
              fixed(width: 64, height: 64, fit: CONTAIN, background: "white") {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
        LinkedIn_Profiles {
          data {
            Logo {
              localFiles {
                childImageSharp {
                  fixed(
                    width: 64
                    height: 64
                    fit: CONTAIN
                    background: "white"
                  ) {
                    ...GatsbyImageSharpFixed
                  }
                }
              }
            }
          }
        }
        Name
        Categories {
          id
          data {
            Name
            Parent {
              id
              data {
                Name
              }
            }
          }
        }
        Tagline
        About
        HQ_Location
        Headcount
        Organization_Type
        Homepage
        LinkedIn
        Twitter
        Tags
      }
    }
  }
`
