import React from "react"
import Img from "gatsby-image"
import { OrganizationTag, OrganizationLocation, OrganizationHeadcount, OrganizationOrgType } from "../components/OrganizationAttributes"

const OrganizationCard = ({ title, description, tags, homepage, location, logo, headcount, orgType, currentFilter, onApplyFilter }) => (
  <div className="flex border-b border-gray-400 p-3 text-gray-900">
    <div className="m-1 mr-5 w-24 flex-shrink-0">
    {logo &&
      <Img fluid={logo} className="h-24 w-24" />
    }
    </div>
    <div className="">
      <a className="font-bold text-lg hover:text-teal-500" href={homepage} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
      <p className="max-h-12 overflow-hidden">{description}</p>
      <div className="mt-3">
        {
          tags && tags.map((tag, i) =>
            <OrganizationTag
              onClick={e => onApplyFilter.byTag(tag)}
              key={i}
              active={tag === currentFilter.byTag}
              text={tag} />
          )
        }
      </div>
      <div className="mt-1">
        {location && 
          <OrganizationLocation 
            onClick={e => onApplyFilter.byLocation(location)} 
            active={location === currentFilter.byLocation}
            text={location} />}
        {headcount && 
          <OrganizationHeadcount 
            onClick={e => onApplyFilter.byHeadcount(headcount)} 
            active={headcount === currentFilter.byHeadcount}
            text={headcount}
            />
        }
        {orgType && 
          <OrganizationOrgType 
            onClick={e => onApplyFilter.byOrgType(orgType)} 
            active={orgType === currentFilter.byOrgType}
            text={orgType}
          />
        }
      </div>
    </div>
  </div>
)
export default OrganizationCard
