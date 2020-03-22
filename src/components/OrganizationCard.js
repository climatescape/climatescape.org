import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"

import {
  OrganizationCategory,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
} from "./OrganizationAttributes"

import "./OrganizationCard.css"

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
    photos,
    categories,
  } = organization

  const subCategories = categories.filter(
    cat => cat.id !== pageContext.categoryId
  )

  const cat =
    categories.find(cat => cat.cover) ||
    categories.find(cat => cat?.parent?.cover)
  const img = logo || photos[0] || cat?.cover || cat?.parent.cover
  return (
    <div className="OrganizationCard mb-4 mt-4 border-gray-400 border-b flex items-center p-3 text-gray-900">
      <div className="mr-5 w-32  flex-shrink-0 hidden sm:block">
        {img && (
          <Link to={slug} className="">
            <Img
              fixed={img}
              className="OrganizationCard-logo rounded-lg w-32 h-32"
            />
          </Link>
        )}
      </div>
      <div>
        <p>
          <Link to={slug} className="font-bold hover:text-teal-500 mr-2">
            {title}
          </Link>
        </p>
        <p> {description}</p>
        <div className="mt-1">
          {subCategories?.map(category => (
            <OrganizationCategory
              key={category.name}
              onClick={() => onApplyFilter.byCategory(category)}
              active={currentFilter?.byCategory?.id === category.id}
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
