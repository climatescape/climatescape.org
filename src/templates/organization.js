import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons"

import {
  OrganizationCategory,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
} from "../components/OrganizationAttributes"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { transformOrganization } from "../utils/airtable"

function getLogoImage({ logo, photos, categories }) {
  const cat =
    categories.find(c => c.cover) || categories.find(c => c?.parent?.cover)
  return logo || photos[0] || cat?.cover || cat?.parent.cover
}

function SocialLink({ href, text, icon }) {
  if (!href) {
    return null
  }

  return (
    <div
      style={{ lineHeight: "3rem" }}
      className="flex flex-1 mr-4 ml-8 mt-6 leading-loose border border-gray-400 rounded-lg shadow-md"
    >
      <a
        className="flex flex-grow px-4 py-2 text-gray-700 items-center"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={icon} className="mr-2" />
        <span className="flex flex-grow">{text}</span>
        <span className="text-gray-500  text-4xl">&rsaquo;</span>
      </a>
    </div>
  )
}

function Tags({ org }) {
  const topCategories = org.categories.filter(cat => !cat.parent)
  const subCategories = org.categories.filter(cat => cat.parent)

  // Show all sub categories as well as top categories not represented
  // by sub categories
  const categoryList = topCategories
    .filter(
      category => !subCategories.map(cat => cat.parent.id).includes(category.id)
    )
    .concat(subCategories)

  return (
    <ul className="my-6">
      {org.location && <OrganizationLocation text={org.location} />}
      {org.headcount && (
        <OrganizationHeadcount text={`${org.headcount} employees`} />
      )}
      {org.orgType && <OrganizationOrgType text={org.orgType} />}
      {categoryList.map(category => (
        <OrganizationCategory key={category.name} text={category.name} />
      ))}
    </ul>
  )
}

export default function OrganizationTemplate({ data }) {
  const siteTitle = data.site.siteMetadata.title
  const org = transformOrganization(data.organization)

  const img = getLogoImage(org)

  return (
    <Layout contentClassName="bg-gray-100 font-sans">
      <SEO title={`${org.title} on ${siteTitle}`} description={org.tagline} />

      <div className="max-w-4xl mx-auto pt-8 pb-4">
        <div className="mb-10 mt-6 flex ">
          <div className="lg:w-3/5">
            <div className="flex">
              <div className="mr-5 w-16  flex-shrink-0 hidden sm:block">
                {img && (
                  <Img
                    fixed={img}
                    className="OrganizationCard-logo blend-multiply rounded-lg w-16 h-16"
                  />
                )}
              </div>
              <div>
                <h1 className="flex-grow text-xl font-semibold">{org.title}</h1>
                <p> {org.description}</p>
              </div>
            </div>
            <Tags org={org} />

            <div className="carousel my-6">
              {org.photos.slice(0, 1).map(photo => (
                <Img fluid={photo} className="organization-img rounded-lg" />
              ))}
            </div>
            {org.about && org.about !== org.tagline && (
              <div className="my-6">{org.about}</div>
            )}
          </div>
          <div className="lg:w-2/5">
            <div className="flex flex-col">
              <SocialLink text="Homepage" href={org.homepage} icon={faLink} />
              <SocialLink
                text="LinkedIn"
                href={org.linkedIn}
                icon={faLinkedin}
              />
              <SocialLink text="Twitter" href={org.twitter} icon={faTwitter} />
            </div>
          </div>
        </div>
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
        Name
        Tagline
        About
        HQ_Location
        Headcount
        Organization_Type
        Homepage
        LinkedIn
        Twitter
        Role
        Tags
        Capital_Profile {
          data {
            Type
            Impact_Specific
            Strategic
            Stage
            CheckSize: Check_Size
          }
        }
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
      }
    }
  }
`
