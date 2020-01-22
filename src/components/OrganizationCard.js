import React from "react"
import Img from "gatsby-image"
import Tag from "./Tag"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faLocationArrow, faBuilding, faTag } from '@fortawesome/free-solid-svg-icons'

function filterDuplicateAndEmptyItems(...items) {
  return [...new Set(items)].filter(m=>m);
}

const OrganizationCard = ({ title, description, tags, homepage, location, logo, headcount, orgType, onPickTag, activeTag }) => (
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
            <Tag
              onClick={e => onPickTag(tag)}
              key={i}
              active={tag === activeTag}
            ><FontAwesomeIcon icon={faTag} className="mr-1" />{tag}</Tag>
          )
        }
      </div>
      <div className="mt-1">
        {location.country && <span className="inline-block mt-1 bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
          <FontAwesomeIcon icon={faLocationArrow} className="mr-1" />{filterDuplicateAndEmptyItems(location.city, location.state, location.country).join(', ')}
        </span>}
        {headcount && 
        <span className="inline-block mt-1 bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
         <FontAwesomeIcon icon={faUsers} className="mr-1" />{headcount}
        </span>}
        {orgType && <span className="inline-block mt-1 bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">
         <FontAwesomeIcon icon={faBuilding} className="mr-1" />{orgType}
        </span>}
      </div>
    </div>
  </div>
)
export default OrganizationCard
