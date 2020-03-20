import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"

import {
  OrganizationSector,
  OrganizationTag,
  OrganizationLocation,
  OrganizationHeadcount,
  OrganizationOrgType,
  OrganizationCapitalType,
  OrganizationCapitalStrategic,
  OrganizationCapitalStage,
  OrganizationCapitalCheckSize,
} from "./OrganizationAttributes"

import "./OrganizationCard.css"

const OrganizationCard = ({
  title,
  description,
  tags,
  slug,
  location,
  logo,
  sector,
  showSector,
  headcount,
  orgType,
  capitalType,
  capitalStrategic,
  capitalStage,
  capitalCheckSize,
  currentFilter,
  onApplyFilter,
}) => (
  <div className="OrganizationCard flex items-center border-b border-gray-400 p-3 text-gray-900">
    <div className="mr-5 w-16 flex-shrink-0 hidden sm:block">
      {logo && (
        <Link to={`/organizations/${slug}`}>
          <Img fixed={logo} className="OrganizationCard-logo w-16 h-16" />
        </Link>
      )}
    </div>
    <div>
      <p>
        <Link
          to={`/organizations/${slug}`}
          className="font-bold hover:text-teal-500 mr-2"
        >
          {title}
        </Link>
        {description}
      </p>
      <div className="mt-1">
        {capitalType &&
          capitalType.map(type => (
            <OrganizationCapitalType
              key={type}
              onClick={() => onApplyFilter.byCapitalType(type)}
              active={type === currentFilter.byCapitalType}
              text={type}
            />
          ))}
        {capitalStrategic && (
          <OrganizationCapitalStrategic
            key="capitalstrategic"
            onClick={() => onApplyFilter.byCapitalStrategic(capitalStrategic)}
            active={capitalStrategic === currentFilter.byCapitalStrategic}
          />
        )}
        {capitalStage &&
          capitalStage.map(stage => (
            <OrganizationCapitalStage
              key={stage}
              onClick={() => onApplyFilter.byCapitalStage(stage)}
              active={stage === currentFilter.byCapitalStage}
              text={stage}
            />
          ))}
        {capitalCheckSize &&
          capitalCheckSize.map(checkSize => (
            <OrganizationCapitalCheckSize
              key={checkSize}
              onClick={() => onApplyFilter.byCapitalCheckSize(checkSize)}
              active={checkSize === currentFilter.byCapitalCheckSize}
              text={checkSize}
            />
          ))}
        {sector && showSector && (
          <OrganizationSector
            onClick={() => onApplyFilter.bySector(sector)}
            active={
              currentFilter.bySector &&
              sector.slug === currentFilter.bySector.slug
            }
            text={sector.name}
          />
        )}
        {tags &&
          tags.map(tag => (
            <OrganizationTag
              onClick={() => onApplyFilter.byTag(tag)}
              key={tag}
              active={tag === currentFilter.byTag}
              text={tag}
            />
          ))}
        {location && (
          <OrganizationLocation
            onClick={() => onApplyFilter.byLocation(location)}
            active={location === currentFilter.byLocation}
            text={location}
          />
        )}
        {headcount && (
          <OrganizationHeadcount
            onClick={() => onApplyFilter.byHeadcount(headcount)}
            active={headcount === currentFilter.byHeadcount}
            text={headcount}
          />
        )}
        {orgType && (
          <OrganizationOrgType
            onClick={() => onApplyFilter.byOrgType(orgType)}
            active={orgType === currentFilter.byOrgType}
            text={orgType}
          />
        )}
      </div>
    </div>
  </div>
)

OrganizationCard.defaultProps = {
  currentFilter: {},
  onApplyFilter: {},
}

OrganizationCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  slug: PropTypes.string,
  location: PropTypes.string,
  logo: PropTypes.object,
  sector: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  headcount: PropTypes.string,
  orgType: PropTypes.string,
  capitalType: PropTypes.arrayOf(PropTypes.string),
  capitalStrategic: PropTypes.bool,
  capitalStage: PropTypes.arrayOf(PropTypes.string),
  capitalCheckSize: PropTypes.arrayOf(PropTypes.string),
  currentFilter: PropTypes.object,
  onApplyFilter: PropTypes.object,
}

export default OrganizationCard
