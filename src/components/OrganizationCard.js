import React from "react"
import Img from "gatsby-image"
import { OrganizationTag, OrganizationLocation, OrganizationHeadcount, OrganizationOrgType } from "../components/OrganizationAttributes"

const OrganizationCard = ({ title, description, tags, homepage, location, logo, headcount, orgType, currentFilter, onApplyFilter }) => (
  <div className="flex items-center border-b border-gray-400 p-3 text-gray-900">
    <div className="mr-5 w-16 flex-shrink-0 hidden sm:block">
    {logo &&
      <Img fixed={logo} className="w-16 h-16" imgStyle={{ filter: "grayscale(100%)" }} />
    }
    </div>
    <div>
      <p>
        <a className="font-bold hover:text-teal-500 mr-2" href={homepage} target="_blank" rel="noopener noreferrer">
          {title}
        </a>

        {description}
      </p>
      <div className="mt-1">
        {
          tags && tags.map((tag, i) =>
            <OrganizationTag
              onClick={e => onApplyFilter.byTag(tag)}
              key={i}
              active={tag === currentFilter.byTag}
              text={tag} />
          )
        }
        {location &&
          <OrganizationLocation
            onClick={e => onApplyFilter.byLocation(location)}
            key='location'
            active={location === currentFilter.byLocation}
            text={location} />}
        {headcount &&
          <OrganizationHeadcount
            onClick={e => onApplyFilter.byHeadcount(headcount)}
            key='headcount'
            active={headcount === currentFilter.byHeadcount}
            text={headcount}
            />
        }
        {orgType &&
          <OrganizationOrgType
            onClick={e => onApplyFilter.byOrgType(orgType)}
            key='orgtype'
            active={orgType === currentFilter.byOrgType}
            text={orgType}
          />
        }
      </div>
    </div>
  </div>
)
export default OrganizationCard
