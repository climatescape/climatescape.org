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
  capitalProfile,
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
        {tags?.map(tag => (
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
  capitalProfile: PropTypes.object,
  currentFilter: PropTypes.object,
  onApplyFilter: PropTypes.object,
}

export default OrganizationCard
