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
} from "./OrganizationAttributes"

import "./OrganizationCard2.css"

const OrganizationCard2 = ({
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
  photos,
  currentFilter,
  onApplyFilter,
}) => (
  <div className="OrganizationCard flex ">
    <div className="photo">
      {photos && <img alt="photo" src={photos[0].url} />}
    </div>
    <div className="summary">
      <div className="title">
        {logo && (
          <div className="logo mr-2">
            <Link to={`/organizations/${slug}`}>
              <Img fixed={logo} className="OrganizationCard-logo" />
            </Link>
          </div>
        )}

        <Link
          to={`/organizations/${slug}`}
          className="org-title font-bold hover:text-teal-500 mr-2"
        >
          {title}
        </Link>
      </div>
      <div className="description"> {description}</div>

      <div className="tags mt-1">
        {sector && showSector && (
          <OrganizationSector
            onClick={() => {
              onApplyFilter.bySector(
                currentFilter.bySector &&
                  sector.slug === currentFilter.bySector.slug
                  ? null
                  : sector
              )
            }}
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
              onClick={() =>
                onApplyFilter.byTag(tag === currentFilter.byTag ? null : tag)
              }
              key={tag}
              active={tag === currentFilter.byTag}
              text={tag}
            />
          ))}
        {/* {location && (
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
        )} */}
      </div>
    </div>
  </div>
)

OrganizationCard2.defaultProps = {
  currentFilter: {},
  onApplyFilter: {},
}

OrganizationCard2.propTypes = {
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
  currentFilter: PropTypes.object,
  onApplyFilter: PropTypes.object,
}

export default OrganizationCard2
