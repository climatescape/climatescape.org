import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
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
    <div className="OrganizationCard border-gray-400 border-b flex items-center p-4 text-gray-900">
      <div className="mr-5 w-32  flex-shrink-0 hidden sm:block">
        {img && (
          <Link to={slug} className="">
            <Img
              fixed={img}
              className="OrganizationCard-logo blend-multiply rounded-lg w-32 h-32"
            />
          </Link>
        )}
      </div>
      <div>
        <p>
          <Link to={slug} className="font-bold hover:text-teal-500 mr-2">
            {title}
          </Link>
          {description}
        </p>
        <div className="mt-1">
          {capitalProfile?.type.map(type => (
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
        fixed(
          width: 128
          height: 128
          fit: CONTAIN
          background: "white"
        ) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }

  fragment OrganizationCard on Airtable {
    data {
      Name
      Homepage
      About
      Tags
      Tagline
      HQ_Location
      Organization_Type
      Headcount
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
