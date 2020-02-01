import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import PropTypes from "prop-types"

import { OrganizationTag, OrganizationLocation, OrganizationHeadcount, OrganizationOrgType } from "../components/OrganizationAttributes"

const OrganizationCard = ({ title, description, tags, slug, homepage, location, logo, headcount, orgType, currentFilter, onApplyFilter }) => (
  <div className="flex items-center border-b border-gray-400 p-3 text-gray-900">
    <div className="mr-5 w-16 flex-shrink-0 hidden sm:block">
    {logo &&
      <Img fixed={logo} className="w-16 h-16" imgStyle={{ filter: "grayscale(100%)" }} />
    }
    </div>
    <div>
      <p>
        { slug
          ? <Link to={`/organizations/${slug}`} className="font-bold hover:text-teal-500 mr-2">{title}</Link>
          : <a className="font-bold hover:text-teal-500 mr-2" href={homepage} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
        }

        {description}
      </p>
      <div className="mt-1">
        {
          tags && tags.map((tag, i) =>
            <OrganizationTag
              onClick={e => onApplyFilter.byTag && onApplyFilter.byTag(tag)}
              key={i}
              active={tag === currentFilter.byTag}
              text={tag} />
          )
        }
        {location &&
          <OrganizationLocation
            onClick={e => onApplyFilter.byLocation && onApplyFilter.byLocation(location)}
            key='location'
            active={location === currentFilter.byLocation}
            text={location} />}
        {headcount &&
          <OrganizationHeadcount
            onClick={e => onApplyFilter.byHeadcount && onApplyFilter.byHeadcount(headcount)}
            key='headcount'
            active={headcount === currentFilter.byHeadcount}
            text={headcount}
            />
        }
        {orgType &&
          <OrganizationOrgType
            onClick={e => onApplyFilter.byOrgType && onApplyFilter.byOrgType(orgType)}
            key='orgtype'
            active={orgType === currentFilter.byOrgType}
            text={orgType}
          />
        }
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
  homepage: PropTypes.string,
  location: PropTypes.string,
  logo: PropTypes.object,
  headcount: PropTypes.string,
  orgType: PropTypes.string,
  currentFilter: PropTypes.object,
  onApplyFilter: PropTypes.object,
}

export default OrganizationCard
