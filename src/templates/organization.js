import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import OrganizationSocial from "../components/OrganizationSocial"
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
    <ul>
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
        <div className="OrganizationCard mb-2 mt-4 flex ">
          <div className="lg:w-3/5">
            <div className="flex">
              <div className="mr-5 w-16  flex-shrink-0 hidden sm:block">
                {img && (
                  <Img
                    fixed={img}
                    className="OrganizationCard-logo rounded-lg w-16 h-16"
                  />
                )}
              </div>
              <div>
                <h1 className="flex-grow text-xl font-semibold">{org.title}</h1>
                <p> {org.description}</p>
              </div>
            </div>
            <Tags org={org} className="mt-3 mb-3" />

            <div className="carousel mt-3 mt-3">
              {org.photos.slice(0, 1).map(photo => (
                <Img fluid={photo} className="organization-img rounded-lg" />
              ))}
            </div>
            {org.about && org.about !== org.tagline && (
              <div className="my-3">{org.about}</div>
            )}
          </div>
          <div className="lg:w-1/5">
            <OrganizationSocial
              homepage={org.homepage}
              linkedIn={org.linkedIn}
              twitter={org.twitter}
            />
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
        Photos {
          localFiles {
            childImageSharp {
              fluid(maxWidth: 700) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          internal {
            content
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
