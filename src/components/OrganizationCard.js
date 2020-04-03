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

function getLogoImage({ logo, photos, categories }) {
  const cat =
    categories.find(c => c.cover) || categories.find(c => c?.parent?.cover)
  return logo || photos[0] || cat?.cover || cat?.parent.cover
}

function truncateDescription(description) {
  const offset = 30
  const index = description?.slice(offset).search(/\./) ?? -1
  return index === -1 ? description : description.substr(0, index + offset + 1)
}

export default function OrganizationCard({
  pageContext,
  organization,
  currentFilter,
  onApplyFilter,
}) {
  const {
    title,
    description,
    location,
    slug,
    headcount,
    orgType,
    capitalProfile,
    categories,
  } = organization

  const subCategories = pageContext
    ? categories.filter(cat => cat.parent?.id === pageContext.categoryId)
    : categories
  const img = getLogoImage(organization)

  return (
    <div className="OrganizationCard border-gray-400 border-b flex items-center py-4 text-gray-900">
      <div className="flex-grow self-start pr-8">
        <p>
          <Link to={slug} className="font-bold hover:text-teal-500 mr-2">
            {title}
          </Link>
          {truncateDescription(description)}
        </p>
        <div className="mt-1">
          {capitalProfile?.type?.map(type => (
            <OrganizationCapitalType
              key={type}
              onClick={() => onApplyFilter.byCapitalType(type)}
              active={type === currentFilter.byCapitalType}
              text={type}
            />
          ))}
          {capitalProfile?.strategic && (
            <OrganizationCapitalStrategic
              key="capitalstrategic"
              onClick={
                () => onApplyFilter.byCapitalStrategic(capitalProfile.strategic)
                // eslint-disable-next-line react/jsx-curly-newline
              }
              active={
                capitalProfile.strategic === currentFilter.byCapitalStrategic
              }
            />
          )}
          {capitalProfile?.stage?.map(stage => (
            <OrganizationCapitalStage
              key={stage}
              onClick={() => onApplyFilter.byCapitalStage(stage)}
              active={stage === currentFilter.byCapitalStage}
              text={stage}
            />
          ))}
          {capitalProfile?.checkSize?.map(checkSize => (
            <OrganizationCapitalCheckSize
              key={checkSize}
              onClick={() => onApplyFilter.byCapitalCheckSize(checkSize)}
              active={checkSize === currentFilter.byCapitalCheckSize}
              text={checkSize}
            />
          ))}
          {subCategories?.map(category => (
            <OrganizationCategory
              key={category.name}
              onClick={() => onApplyFilter.byCategory(category)}
              active={category.id === currentFilter.byCategory?.id}
              text={category.name}
            />
          ))}
          {location && (
            <OrganizationLocation
              onClick={() => onApplyFilter.byLocation(location)}
              key="location"
              active={location === currentFilter.byLocation}
              text={location}
            />
          )}
          {headcount && (
            <OrganizationHeadcount
              onClick={() => onApplyFilter.byHeadcount(headcount)}
              key="headcount"
              active={headcount === currentFilter.byHeadcount}
              text={headcount}
            />
          )}
          {orgType && (
            <OrganizationOrgType
              onClick={() => onApplyFilter.byOrgType(orgType)}
              key="orgtype"
              active={orgType === currentFilter.byOrgType}
              text={orgType}
            />
          )}
        </div>
      </div>
      <div className="w-24 flex-shrink-0 hidden sm:block">
        {img && (
          <Link to={slug} className="">
            <img
              src={img.src}
              alt={`${title} logo`}
              className="OrganizationCard-logo blend-multiply rounded-lg w-24 h-24"
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </div>
  )
}

OrganizationCard.defaultProps = {
  currentFilter: {},
  onApplyFilter: {},
}

OrganizationCard.propTypes = {
  organization: PropTypes.object,
  currentFilter: PropTypes.object,
  onApplyFilter: PropTypes.object,
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
    data {
      Name
      Homepage
      About
      Tagline
      HQ_Location
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
          Type
          Strategic
          Stage
          CheckSize: Check_Size
        }
      }
    }
  }
`
