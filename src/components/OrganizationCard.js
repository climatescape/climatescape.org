import React from "react"
import { Link } from "gatsby"
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

function OrganizationCard({
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
    logo,
    categories,
    capitalProfile,
  } = organization

  const subCategories = pageContext ? categories.filter(
    cat => cat.parent?.id === pageContext.categoryId
  ) : categories
  return (
    <div className="OrganizationCard flex items-center border-b border-gray-400 p-3 text-gray-900">
      <div className="mr-5 w-16 flex-shrink-0 hidden sm:block">
        {logo && (
          <Link to={slug}>
            <Img fixed={logo} className="OrganizationCard-logo w-16 h-16" />
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
              category={category}
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

export default OrganizationCard
