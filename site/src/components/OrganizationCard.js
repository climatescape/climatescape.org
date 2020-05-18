import React from "react"
import { Link, graphql } from "gatsby"
import PropTypes from "prop-types"

import {
  OrganizationCategory,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
  OrganizationCapitalType,
  OrganizationCapitalStrategic,
  OrganizationCapitalStage,
  OrganizationCapitalCheckSize,
} from "./OrganizationAttributes"

import FavoriteButton from "./FavoriteButton"

function getLogoImage({ logo, photos, categories }) {
  const cat =
    categories.find(c => c.cover) || categories.find(c => c?.parent?.cover)
  return logo || photos[0] || cat?.cover || cat?.parent.cover
}

export default function OrganizationCard({ categoryId, organization }) {
  const {
    title,
    description,
    hqLocation,
    slug,
    headcount,
    orgType,
    capitalProfile,
    categories,
  } = organization

  const subCategories = categoryId
    ? categories.filter(cat => cat.parent?.id === categoryId)
    : categories
  const img = getLogoImage(organization)

  return (
    <div className="border-gray-400 border-b flex text-gray-900 relative">
      <Link
        to={slug}
        className="flex flex-grow py-2 sm:py-4 sm:pl-2 sm:pr-16 hover:bg-gray-200"
      >
        <div className="w-24 flex-shrink-0 hidden sm:block">
          {img && (
            <img
              src={img.src}
              alt={`${title} logo`}
              className="blend-multiply rounded-sm w-20 h-20"
              loading="lazy"
            />
          )}
        </div>
        <div className="flex-grow flex flex-col justify-center sm:pl-4">
          <p>
            <span className="font-bold mr-2">{title}</span>
            {description}
          </p>
          <div className="mt-1">
            {capitalProfile?.type?.map(type => (
              <OrganizationCapitalType key={type} text={type} />
            ))}
            {capitalProfile?.strategic && (
              <OrganizationCapitalStrategic key="capitalstrategic" />
            )}
            {capitalProfile?.stage && (
              <OrganizationCapitalStage
                key="stage"
                stages={capitalProfile?.stage}
              />
            )}
            {capitalProfile?.checkSize && (
              <OrganizationCapitalCheckSize
                key="checkSize"
                checkSizes={capitalProfile?.checkSize}
              />
            )}
            {subCategories?.map(category => (
              <OrganizationCategory key={category.name} text={category.name} />
            ))}
            {hqLocation && <OrganizationLocation location={hqLocation} />}
            {headcount && (
              <OrganizationHeadcount key="headcount" text={headcount} />
            )}
            {orgType && <OrganizationOrgType key="orgtype" text={orgType} />}
          </div>
        </div>
      </Link>
      <FavoriteButton
        recordId={organization.recordId}
        favoriteId={organization.favorite?.id}
        count={organization.favorite?.count}
        className="mr-2 absolute right-0 top-1/2 -mt-8 hidden sm:block"
      />
    </div>
  )
}

OrganizationCard.propTypes = {
  organization: PropTypes.object,
}

// Includes all the expected attributes for rendering an OrganizationCard. To
// query Capital Profile information, use the CapitalOrganizationCard fragment
export const query = graphql`
  fragment OrganizationCardLogo on AirtableField {
    localFiles {
      childImageSharp {
        resize(width: 256, height: 256, fit: CONTAIN, background: "white") {
          src
        }
      }
    }
  }

  fragment OrganizationCardPhoto on AirtableField {
    localFiles {
      childImageSharp {
        resize(width: 256, height: 256, fit: COVER) {
          src
        }
      }
    }
    internal {
      content
    }
  }

  fragment OrganizationCard on Airtable {
    recordId
    data {
      Name
      Homepage
      About
      Tagline
      HQ_Country
      HQ_Region
      HQ_Locality
      Organization_Type
      Headcount
      Role
      Photos {
        ...OrganizationCardPhoto
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
      Logo {
        ...OrganizationCardLogo
      }
      Crunchbase_ODM {
        data {
          Logo {
            ...OrganizationCardLogo
          }
        }
      }
      LinkedIn_Profiles {
        data {
          Logo {
            ...OrganizationCardLogo
          }
        }
      }
    }
  }

  fragment CapitalOrganizationCard on Airtable {
    ...OrganizationCard
    data {
      Capital_Profile {
        data {
          Strategic
          ImpactSpecific: Impact_Specific
          Stage
          CheckSize: Check_Size
          CapitalType: Capital_Type {
            data {
              Name
            }
          }
        }
      }
    }
  }
`
