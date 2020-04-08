import React from "react"
import "./organization.css"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faExternalLinkAlt,
  faEdit,
  faBox,
  faMapMarkerAlt,
  faUsers,
  faBuilding,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons"
import {
  faLinkedin,
  faTwitter,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Carousel from "../components/carousel"
import SidebarSectionList from "../components/SidebarSectionList"
import { transformOrganization } from "../utils/airtable"
import { parseTwitterPath, buildUrl } from "../utils/url"

function isCapital(org) {
  return org.role?.includes("Capital")
}

function getLogoImage({ logo, photos, categories }) {
  const cat =
    categories.find(c => c.cover) || categories.find(c => c?.parent?.cover)
  return logo || photos[0] || cat?.cover || cat?.parent.cover
}

function getEditUrl({ data, org }) {
  const { capitalEditFormUrl, organizationEditFormUrl } = data.site.siteMetadata
  const url = isCapital(org) ? capitalEditFormUrl : organizationEditFormUrl
  return `${url}?prefill_Organization=${encodeURI(org.title)}`
}

function AttributesSection({ org, className }) {
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
    <SidebarSectionList title="In a snapshot" className={className}>
      {categoryList.map(category => (
        <SidebarSectionList.Item
          key={category.name}
          text={category.name}
          icon={<FontAwesomeIcon icon={faBox} />}
        />
      ))}
      {
        <SidebarSectionList.Item
          text={org.location}
          icon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
          hidden={!org.location}
        />
      }
      <SidebarSectionList.Item
        text={org.orgType}
        icon={<FontAwesomeIcon icon={faBuilding} />}
        hidden={!org.orgType}
      />
      <SidebarSectionList.Item
        text={`${org.headcount} employees`}
        icon={<FontAwesomeIcon icon={faUsers} />}
        hidden={!org.headcount}
      />
    </SidebarSectionList>
  )
}

function ContributionSection({ data, org, className }) {
  return (
    <SidebarSectionList title="Edit History" className={className}>
      <SidebarSectionList.Link
        href={getEditUrl({ data, org })}
        text="Suggest an Edit"
        icon={<FontAwesomeIcon icon={faEdit} />}
      />

      {org.source && (
        <SidebarSectionList.Link
          text={`Source - ${org.source.name}`}
          href={org.source.url}
          icon={<FontAwesomeIcon icon={faFileAlt} />}
        />
      )}
    </SidebarSectionList>
  )
}

function SocialLinksSection({ org, className }) {
  return (
    <SidebarSectionList title="Links" className={className}>
      <SidebarSectionList.Link
        text="Homepage"
        href={org.homepage}
        icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
      />
      <SidebarSectionList.Link
        text="Crunchbase"
        href={org.crunchbase}
        icon={<FontAwesomeIcon icon={faExternalLinkAlt} />}
      />
      <SidebarSectionList.Link
        text={org.title}
        href={org.linkedIn}
        icon={<FontAwesomeIcon icon={faLinkedin} />}
      />
      <SidebarSectionList.Link
        text={parseTwitterPath(org.twitter)}
        href={buildUrl(org.twitter, "Twitter")}
        icon={<FontAwesomeIcon icon={faTwitter} />}
      />
      <SidebarSectionList.Link
        text="Facebook"
        href={org.facebook}
        icon={<FontAwesomeIcon icon={faFacebook} />}
      />
    </SidebarSectionList>
  )
}

export default function OrganizationTemplate({ data }) {
  const siteTitle = data.site.siteMetadata.title

  const org = transformOrganization(data.organization, (raw, out) => ({
    ...out,
    fullPhotos: raw.data.fullPhotos?.localFiles || [],
  }))

  const img = getLogoImage(org)

  return (
    <Layout contentClassName="bg-gray-100 font-sans">
      <SEO title={`${org.title} on ${siteTitle}`} description={org.tagline} />

      <div className="max-w-4xl mx-auto lg:pt-8 pb-4 p-4 xs:p-8 lg:p-0">
        <div className="mb-10 md:mt-6 flex flex-col lg:flex-row">
          <div className="w-5/5 lg:w-3/5">
            <div className="flex">
              <div className={ `mr-5 w-16 flex-shrink-0 ${  !img ? `hidden`: `block`   }` }>
                {img && (
                  <Img
                    fixed={img}
                    className="OrganizationCard-logo blend-multiply rounded-lg w-16 h-16"
                  />
                )}
              </div>
              <div>
                <h1 className="flex-grow text-xl font-semibold">{org.title}</h1>
                <p>{org.description}</p>
              </div>
            </div>

            {org.fullPhotos[0] && (
              <div className="carousel my-8 bg-gray-200 rounded-lg">
                <Carousel
                  height="20rem"
                  // FIXME: using reverse since the images are in the reverse order of airtable
                  // display
                  images={org.fullPhotos.reverse().map(photo => ({
                    url: photo.publicURL,
                    title: photo.title,
                  }))}
                />
              </div>
            )}

            {org.about && org.about !== org.tagline && (
              <div className="my-6">{org.about}</div>
            )}
          </div>

          <div className="flex flex-col w-5/5 lg:w-2/5 lg:pl-16 items-center mt-3 lg:mt-0">
            <div className="sidebar-sections-container w-full flex flex-col sm:flex-row lg:flex-col justify-start justify-around lg:justify-start">
              <AttributesSection org={org} className="flex flex-col mb-8" />
              <SocialLinksSection org={org} className="flex flex-col mb-8" />
              <ContributionSection
                org={org}
                className="flex flex-col mb-8"
                data={data}
              />
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
        organizationEditFormUrl
        capitalEditFormUrl
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
        Facebook
        Crunchbase
        Role
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
        Photos {
          ...OrganizationCardPhoto
        }
        fullPhotos: Photos {
          localFiles {
            publicURL
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
            Cover {
              ...OrganizationCardPhoto
            }
            Parent {
              id
              data {
                Name
                Cover {
                  ...OrganizationCardPhoto
                }
              }
            }
          }
        }
        Source {
          data {
            Name
            URL
          }
        }
      }
    }
  }
`
